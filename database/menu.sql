create table
  public.menu (
    id uuid not null default gen_random_uuid (),
    menutitle character varying null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone null default now(),
    position bigint null,
    constraint menu_pkey primary key (id)
  ) tablespace pg_default;