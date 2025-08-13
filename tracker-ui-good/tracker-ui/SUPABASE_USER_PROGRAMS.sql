-- Create a simple per-user storage for the 5/3/1 workflow
-- Run this in your Supabase SQL Editor (connected to the same project the app uses)

create table if not exists public.user_programs (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  program_type text default 'five_three_one',
  program_name text default '5/3/1 Workflow',
  five_three_one_workflow jsonb default '{}'::jsonb,
  version integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_programs enable row level security;

create policy "Users can manage own user_programs" on public.user_programs
  for all using (auth.uid() = user_id);

-- Optional: keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_user_programs_updated_at on public.user_programs;
create trigger trg_user_programs_updated_at
before update on public.user_programs
for each row execute procedure public.set_updated_at();
