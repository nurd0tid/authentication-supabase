create table
  public.menu_sub_item (
    id uuid not null default gen_random_uuid (),
    menu_item_id uuid null,
    path character varying null,
    type character varying null,
    active boolean null default false,
    selected boolean null default false,
    title character varying null,
    position bigint null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone null default now(),
    constraint menu_sub_item_pkey primary key (id),
    constraint public_menu_sub_item_menu_item_id_fkey foreign key (menu_item_id) references menu_item (id)
  ) tablespace pg_default;