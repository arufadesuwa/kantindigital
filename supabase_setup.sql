-- Trigger untuk membuat entry di public.users setiap kali ada user baru di auth.users
-- Jalankan script ini di SQL Editor Supabase Anda

-- 1. Pastikan table users ada (jika belum)
create table if not exists public.users (
  userid uuid references auth.users on delete cascade not null primary key,
  email text,
  username text,
  role_id int default 1, -- 1: Customer, 2: Admin (sesuaikan dengan table roles Anda)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Buat Function untuk handle new user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (userid, email, username, role_id)
  values (
    new.id, 
    new.email, 
    split_part(new.email, '@', 1), -- Default username dari email
    1 -- Default role: Customer
  );
  return new;
end;
$$;

-- 3. Buat Trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
