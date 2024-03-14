create table
  public.users (
    id uuid not null default gen_random_uuid (),
    name character varying not null,
    email character varying not null,
    password character varying not null,
    revoked_web boolean null default true,
    revoked_mobile boolean null default true,
    updated_at timestamp with time zone null default now(),
    created_at timestamp with time zone not null default now(),
    two_factor boolean null default false,
    otp_code character varying null,
    role_id uuid null default gen_random_uuid (),
    photo character varying null,
    constraint users_pkey primary key (id),
    constraint users_email_key unique (email),
    constraint public_users_role_id_fkey foreign key (role_id) references roles (id)
  ) tablespace pg_default;