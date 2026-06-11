-- Allow agency admins to save profile settings (user + agency rows) from the dashboard.

create or replace function public.update_agency_profile_settings(
    p_full_name text,
    p_phone text,
    p_agency_name text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_user_id uuid := auth.uid();
    v_agency_id uuid;
    v_user public.users;
    v_agency public.agencies;
begin
    if v_user_id is null then
        raise exception 'Not authenticated.';
    end if;

    select *
    into v_user
    from public.users
    where id = v_user_id;

    if not found then
        raise exception 'User profile not found.';
    end if;

    if v_user.role <> 'AGENCY_ADMIN' then
        raise exception 'Only agency administrators can update profile settings.';
    end if;

    v_agency_id := v_user.agency_id;

    if v_agency_id is null then
        select a.id
        into v_agency_id
        from public.agencies a
        where a.user_id = v_user_id
        limit 1;
    end if;

    if v_agency_id is null then
        v_agency_id := public.current_agency_id_for_auth_user();
    end if;

    if v_agency_id is null then
        raise exception 'No agency is linked to your account.';
    end if;

    update public.users
    set
        full_name = p_full_name,
        phone = p_phone,
        updated_at = now()
    where id = v_user_id
    returning * into v_user;

    update public.agencies
    set
        full_name = p_agency_name,
        phone = p_phone,
        updated_at = now()
    where id = v_agency_id
    returning * into v_agency;

    if v_agency.id is null then
        raise exception 'Agency profile could not be updated.';
    end if;

    return jsonb_build_object(
        'user', to_jsonb(v_user),
        'agency', to_jsonb(v_agency),
        'agency_id', v_agency_id
    );
end;
$$;

revoke all on function public.update_agency_profile_settings(text, text, text) from public;
grant execute on function public.update_agency_profile_settings(text, text, text) to authenticated;

drop policy if exists "Agency admins update own agency" on public.agencies;

create policy "Agency admins update own agency"
    on public.agencies
    for update
    to authenticated
    using (
        exists (
            select 1
            from public.users u
            where u.id = auth.uid()
                and u.role = 'AGENCY_ADMIN'
                and (
                    u.agency_id = agencies.id
                    or agencies.user_id = u.id
                    or agencies.id = public.current_agency_id_for_auth_user()
                )
        )
    )
    with check (
        exists (
            select 1
            from public.users u
            where u.id = auth.uid()
                and u.role = 'AGENCY_ADMIN'
                and (
                    u.agency_id = agencies.id
                    or agencies.user_id = u.id
                    or agencies.id = public.current_agency_id_for_auth_user()
                )
        )
    );
