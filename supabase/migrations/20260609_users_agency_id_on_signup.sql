-- Persist agency_id from auth signup metadata into public.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    agency uuid;
begin
    agency := nullif(new.raw_user_meta_data->>'agency_id', '')::uuid;

    insert into public.users (
        id,
        email,
        full_name,
        role,
        avatar_url,
        agency_id,
        created_at,
        updated_at
    )
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', ''),
        coalesce(new.raw_user_meta_data->>'role', 'CLIENT'),
        nullif(new.raw_user_meta_data->>'avatar_url', ''),
        agency,
        now(),
        now()
    )
    on conflict (id) do update set
        email = coalesce(excluded.email, public.users.email),
        full_name = coalesce(excluded.full_name, public.users.full_name),
        role = coalesce(excluded.role, public.users.role),
        avatar_url = coalesce(excluded.avatar_url, public.users.avatar_url),
        agency_id = coalesce(excluded.agency_id, public.users.agency_id),
        updated_at = now();

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();
