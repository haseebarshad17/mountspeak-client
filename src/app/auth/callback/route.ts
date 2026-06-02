import { createServerSupabase } from "@/lib/supabase/supabase.server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = requestUrl.searchParams.get("next") ?? "/dashboard";
  const safeNextPath = nextPath.startsWith("/") ? nextPath : "/dashboard";
  const loginUrl = new URL("/login", request.url);

  if (!code) {
    loginUrl.searchParams.set("error", "oauth_failed");
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createServerSupabase();

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    loginUrl.searchParams.set("error", "oauth_failed");
    return NextResponse.redirect(loginUrl);
  }

  const { data: authUserData } = await supabase.auth.getUser();
  const user = authUserData.user;
  if (!user) {
    loginUrl.searchParams.set("error", "oauth_failed");
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "CLIENT") {
    await supabase.auth.signOut();
    loginUrl.searchParams.set("error", "role_not_allowed");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(safeNextPath, request.url));
}
