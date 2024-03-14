create table
  public.permissions (
    id uuid not null default gen_random_uuid (),
    name character varying null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone null default now(),
    constraint permissions_pkey primary key (id)
  ) tablespace pg_default;