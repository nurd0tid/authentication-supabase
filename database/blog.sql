create table
  public.blog (
    id uuid not null default gen_random_uuid (),
    title character varying null,
    description text null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone null default now(),
    constraint blog_pkey primary key (id)
  ) tablespace pg_default;