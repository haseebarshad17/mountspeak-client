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


agency_site_theme

Marketing homepage config per agency (see `src/services/homepage/homepage.page.types.ts`).

- id: uuid (PK)
- agency_id: uuid (FK → agencies.id)
- site_url: text — e.g. `http:localhost:3000` or `https://adventurehq.example.com` (PostgREST: `site_url=eq.{value}`)
- theme: jsonb — `{ "page": { ... } }` (shape in `homepage.page.types.ts`)
- branding_logos: text[] — storage paths in `agency-branding-logos` bucket (trust marquee logos)
- created_at, updated_at: timestamp

Public read via RLS. App calls `GET /rest/v1/agency_site_theme?site_url=eq.{url}` with URL candidates built from the request `Host` header.


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

- id: uuid (PK)
- agency_id: uuid (FK → agencies.id, nullable)
- driver_id: uuid (nullable)
- title: text
- slug: text (unique) — detail URL: `/tours/{slug}`
- from_location, to_location: text
- start_date, end_date: date
- price_per_seat: numeric
- discount_percent: numeric — card badge (`10` → `10.00% Off`)
- kids_discount: numeric — percent off each child seat (ages 4–8)
- capacity_total: integer
- publication_status: enum `tour_publication_status` — `PUBLISHED` | `UNPUBLISHED`
- header: jsonb — `{ tag, title, subtitle, hero_image_url, day_count, night_count }`
- overview: jsonb — `{ title, body, elevation_m, difficulty, image_url }`
- highlights: jsonb — `[{ icon, title, description }]`
- route: jsonb — `{ section_title, segments: [{ title, description }] }`
- places_visited: jsonb — `[{ name, location_label, image_url }]`
- journey: jsonb — `[{ day, title, description, image_url }]`
- stay_and_dine: jsonb — `[{ category, name, description, image_url, amenities }]`
- expedition_perks: jsonb — `[{ icon, title, description }]`
- visual_fragments: jsonb — `string[]` storage paths
- created_at: timestamp

Storage paths (e.g. `agency-id/tour-id/hero.webp`) → public URL via bucket `tour-media` (`NEXT_PUBLIC_SUPABASE_TOUR_STORAGE_BUCKET`).

Public read: RLS `publication_status = 'PUBLISHED'` (see `supabase/migrations/20260603_tours_marketing_columns.sql`)


bookings

Insert payload (expedition booking form):

```json
{
  "tour_id": "uuid",
  "male_seat": 8,
  "female_seat": 2,
  "kids_seats": 0,
  "amount_total": "9960.00",
  "notes": null,
  "name": "First Last",
  "email": "user@example.com",
  "cnic": "12345-1234567-1",
  "phone": "+923001234567",
  "emergency_phone": "+923009876543",
  "booking_payment_screenshot": null
}
```

Columns: `id`, `tour_id`, `agency_id`, `name`, `email`, `phone`, `emergency_phone`, `cnic`, `male_seat`, `female_seat`, `kids_seats`, `amount_total`, `notes`, `booking_payment_screenshot`, `status`, `created_at`, `updated_at`.

Payment screenshot: upload to bucket `booking-payment-screenshots` at `{agency_id}/{booking_id}/payment.{ext}`, then set `booking_payment_screenshot` to the public URL.

Child pricing on tours uses `kids_discount` (percent off kids seats only).


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
        nullif(new.raw_user_meta_data->>'agency_id', '')::uuid,
        now(),
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