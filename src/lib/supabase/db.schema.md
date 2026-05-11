<!-- lib/supabase/db.schema.md  -->
 
# Supaase Tables + Schema

plans

- id: uuid (PK, default: gen_random_uuid())
- name: text
- slug: text (unique)
- price: numeric
- interval: text (monthly | yearly)
- websites_limit: integer
- domains_limit: integer
- features: text[]
- is_active: boolean (default: true)
- created_at: timestamp (default: now())


profiles

- id: uuid (PK, references auth.users.id, default: auth.uid())
- full_name: text
- email: text
- role: text
- avatar_url: text
- created_at: timestamp (default: now())


agencies

- id: uuid (PK, default: gen_random_uuid())
- name: text
- slug: text (unique)
- owner_id: uuid (FK → profiles.id)
- status: text (active | suspended | pending)
- created_at: timestamp (default: now())


agency_members

- id: uuid (PK, default: gen_random_uuid())
- agency_id: uuid (FK → agencies.id)
- user_id: uuid (FK → profiles.id)
- role: text (admin | member)
- created_at: timestamp (default: now())


onboarding_sessions

- id: uuid (PK, default: gen_random_uuid())
- user_id: uuid (FK → profiles.id)
- agency_id: uuid (nullable, FK → agencies.id)
- current_step: text
- completed: boolean (default: false)
- created_at: timestamp (default: now())
- updated_at: timestamp (default: now())


subscriptions

- id: uuid (PK, default: gen_random_uuid())
- agency_id: uuid (FK → agencies.id)
- plan: text
- status: text (active | expired | canceled)
- starts_at: timestamp
- ends_at: timestamp
- created_at: timestamp (default: now())


tours

- id: uuid (PK, default: gen_random_uuid())
- agency_id: uuid (FK → agencies.id)
- title: text
- description: text
- price: numeric
- location: text
- images: text[]
- theme_config: jsonb
- is_published: boolean (default: false)
- created_at: timestamp (default: now())


bookings

- id: uuid (PK, default: gen_random_uuid())
- tour_id: uuid (FK → tours.id)
- customer_id: uuid (FK → profiles.id)
- status: text (pending | confirmed | canceled)
- booking_date: timestamp
- created_at: timestamp (default: now())


payments

- id: uuid (PK, default: gen_random_uuid())
- booking_id: uuid (FK → bookings.id)
- amount: numeric
- status: text
- provider: text
- created_at: timestamp (default: now())



# Edge Functions trigiger + helpers


<!-- Profile creation after auth-row insertion  -->

```sql  
    drop function if exists public.handle_new_user cascade;
 
    create or replace function public.handle_new_user()
    returns trigger
    language plpgsql
    security definer
    as $$
    begin
      insert into public.profiles (
        id,
        email,
           full_name,
           role,
           avatar_url,
           created_at
      )
      values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', ''),
        coalesce(new.raw_user_meta_data->>'role', 'agency_client'),
        coalesce(new.raw_user_meta_data->>'avatar_url', ''),
        now()
      );
    
      return new;
    end;
    $$;
```

```sql  
    drop trigger if exists on_auth_user_created on auth.users;
     
    create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();
```


<!-- Profile deletion after auth-row removed  -->

```sql  
    drop function if exists public.handle_delete_user cascade;

    create or replace function public.handle_delete_user()
    returns trigger
    language plpgsql
    security definer
    as $$
    begin
    
      delete from public.profiles
      where id = old.id;
    
      return old;
    
    end;
    $$;
```

```sql 
    drop trigger if exists on_auth_user_deleted
    on auth.users;
    
    create trigger on_auth_user_deleted
    after delete on auth.users
    for each row
    execute function public.handle_delete_user();
```