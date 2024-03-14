create table
  public.role_menu_permissions (
    id uuid not null default gen_random_uuid (),
    role_id uuid null,
    menu_item_id uuid null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone null default now(),
    path character varying null,
    constraint role_menu_permissions_pkey primary key (id),
    constraint public_role_menu_permissions_role_id_fkey foreign key (role_id) references roles (id)
  ) tablespace pg_default;