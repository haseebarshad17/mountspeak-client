import { AGENCY_PREVIEW_HOST_COOKIE, prefixHref } from "@/lib/homepage/agency-preview";
import { DEFAULT_AGENCY_ID } from "@/lib/homepage/default-homepage";
import { createServerSupabase } from "@/lib/supabase/supabase.server";
import {
  getServerSiteUrl,
  normalizeAuthRedirectPath,
} from "@/lib/utils/site-url";
import { recordServerEvent } from "@/services/events/events.server";
import { fetchAgencyHomepage } from "@/services/homepage/homepage.server";
import { NextRequest, NextResponse } from "next/server";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseAgencyIdParam(value: string | null): string | null {
  const trimmed = value?.trim();
  if (!trimmed || !UUID_RE.test(trimmed) || trimmed === DEFAULT_AGENCY_ID) {
    return null;
  }
  return trimmed;
}

function buildAuthRedirectUrl(
  request: NextRequest,
  siteUrl: string,
  path: string,
): URL {
  const previewHost = request.cookies.get(AGENCY_PREVIEW_HOST_COOKIE)?.value?.trim();
  const previewBase = previewHost ? `/${previewHost}` : null;
  const safePath = normalizeAuthRedirectPath(path.startsWith("/") ? path : "/dashboard");
  const prefixedPath = prefixHref(safePath, previewBase);
  return new URL(prefixedPath, siteUrl);
}

export async function GET(request: NextRequest) {
  const siteUrl = getServerSiteUrl(request);
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const providerError = requestUrl.searchParams.get("error");
  const providerErrorDescription =
    requestUrl.searchParams.get("error_description");
  const nextPath = requestUrl.searchParams.get("next") ?? "/dashboard";
  const safeNextPath = nextPath.startsWith("/") ? nextPath : "/dashboard";
  const queryAgencyId = parseAgencyIdParam(requestUrl.searchParams.get("agency_id"));
  const loginUrl = buildAuthRedirectUrl(request, siteUrl, "/login");

  if (providerError) {
    loginUrl.searchParams.set("error", "oauth_failed");
    if (providerErrorDescription) {
      loginUrl.searchParams.set("error_description", providerErrorDescription);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    loginUrl.searchParams.set("error", "oauth_failed");
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createServerSupabase();

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    loginUrl.searchParams.set("error", "oauth_failed");
    loginUrl.searchParams.set("error_description", exchangeError.message);
    return NextResponse.redirect(loginUrl);
  }

  const { data: authUserData } = await supabase.auth.getUser();
  const user = authUserData.user;
  if (!user) {
    loginUrl.searchParams.set("error", "oauth_failed");
    return NextResponse.redirect(loginUrl);
  }

  const homepage = await fetchAgencyHomepage();
  const homepageAgencyId =
    homepage.isAgencySite &&
    homepage.agencyId &&
    homepage.agencyId !== DEFAULT_AGENCY_ID
      ? homepage.agencyId
      : null;

  const agencyId = homepageAgencyId ?? queryAgencyId;

  if (agencyId) {
    const { error: ensureError } = await supabase.rpc("ensure_agency_client_membership", {
      p_agency_id: agencyId,
    });

    if (ensureError) {
      await supabase.auth.signOut();
      loginUrl.searchParams.set("error", "oauth_failed");
      return NextResponse.redirect(loginUrl);
    }

    const { data: canAccess, error: accessError } = await supabase.rpc(
      "can_access_agency_customer_site",
      { p_agency_id: agencyId },
    );

    if (accessError || !canAccess) {
      await supabase.auth.signOut();
      loginUrl.searchParams.set("error", "customer_site_access_denied");
      return NextResponse.redirect(loginUrl);
    }

    const createdAtMs = user.created_at ? Date.parse(user.created_at) : NaN;
    const isNewUser =
      Number.isFinite(createdAtMs) && Date.now() - createdAtMs < 10 * 60 * 1000;

    await recordServerEvent({
      supabase,
      agencyId,
      eventType: isNewUser ? "SIGNUP" : "LOGIN",
      path: "/auth/callback",
      ipAddress:
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip")?.trim() ||
        null,
      userAgent: request.headers.get("user-agent"),
      metadata: {
        provider: user.app_metadata?.provider ?? "email",
        email: user.email ?? null,
      },
    });
  }

  return NextResponse.redirect(buildAuthRedirectUrl(request, siteUrl, safeNextPath));
}
