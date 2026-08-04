create table if not exists public.tool_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  tool_type text not null check (tool_type in ('tool', 'automation', 'n8n_workflow', 'agent', 'other')),
  description text not null,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'done', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tool_requests enable row level security;

-- Public (anon key) can only INSERT new requests, nothing else.
create policy "anon can insert tool requests"
  on public.tool_requests
  for insert
  to anon
  with check (true);

-- Only service_role (used by CLI, never exposed publicly) can read/update/delete.
create policy "service role full access"
  on public.tool_requests
  for all
  to service_role
  using (true)
  with check (true);

create index if not exists tool_requests_status_idx on public.tool_requests (status);
create index if not exists tool_requests_created_at_idx on public.tool_requests (created_at desc);
