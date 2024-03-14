create table
  public.role_permissions (
    id uuid not null default gen_random_uuid (),
    role_id uuid null default gen_random_uuid (),
    permission_id uuid null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone null default now(),
    constraint role_permissions_pkey primary key (id),
    constraint public_role_permissions_permission_id_fkey foreign key (permission_id) references permissions (id),
    constraint public_role_permissions_role_id_fkey foreign key (role_id) references roles (id)
  ) tablespace pg_default;