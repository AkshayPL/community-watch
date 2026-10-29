-- Flipkart Trust Radar - Supabase PostgreSQL Schema & Security Policies
-- Run this in your Supabase SQL Editor (https://supabase.com)

-- 1. Products Table
create table if not exists products (
  pid text primary key,
  title text,
  category text,
  default_seller text,
  created_at timestamp with time zone default now()
);

-- 2. Anonymous Community Reports Table
create table if not exists reports (
  id uuid default gen_random_uuid() primary key,
  pid text references products(pid) on delete cascade,
  user_alias text default 'Anonymous Shopper',
  verdict text check (verdict in ('dont_buy', 'caution', 'buy')),
  categories text[] not null,
  seller_name text,
  title text not null,
  description text not null,
  flipkart_resolution text check (flipkart_resolution in ('denied', 'pending', 'resolved')),
  verified_purchase boolean default false,
  helpful_count int default 0,
  created_at timestamp with time zone default now()
);

-- Index for instant lookup by Flipkart Product ID
create index if not exists idx_reports_pid on reports(pid);
create index if not exists idx_reports_created_at on reports(created_at desc);

-- 3. Row Level Security (RLS) Configuration
alter table products enable row level security;
alter table reports enable row level security;

-- Public read access for everyone
create policy "Anyone can read products" 
  on products for select 
  using (true);

create policy "Anyone can read reports" 
  on reports for select 
  using (true);

-- Anyone can submit products and reports anonymously
create policy "Anyone can insert products" 
  on products for insert 
  with check (true);

create policy "Anyone can submit anonymous reports" 
  on reports for insert 
  with check (
    char_length(description) >= 5 and 
    char_length(description) <= 3000
  );

-- Only authenticated admins/moderators can update or delete
create policy "Only service role can update or delete"
  on reports for all
  using (auth.role() = 'service_role');
