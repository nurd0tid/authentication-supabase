create table
  public.menu_item (
    id uuid not null default gen_random_uuid (),
    menu_id uuid null default gen_random_uuid (),
    path character varying null,
    icon character varying null,
    type character varying null,
    active boolean null default false,
    selected boolean null default false,
    title character varying null,
    position bigint null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone null default now(),
    constraint menu_item_pkey primary key (id),
    constraint public_menu_item_menu_id_fkey foreign key (menu_id) references menu (id)
  ) tablespace pg_default;