create table
  public.blacklist (
    id uuid not null default gen_random_uuid (),
    token_blacklist character varying null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone null default now(),
    constraint blacklist_pkey primary key (id)
  ) tablespace pg_default;