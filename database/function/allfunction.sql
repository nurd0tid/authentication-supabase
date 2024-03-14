-- get data blog
CREATE OR REPLACE FUNCTION public.get_fn_blog(
  p_limit INTEGER,
  p_offset INTEGER,
  p_search_text TEXT
)
RETURNS TABLE(row_count BIGINT, data JSONB)
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  WITH row_count_cte AS (
    SELECT COUNT(*) AS count
    FROM blog
    WHERE (p_search_text IS NULL OR title ILIKE '%' || p_search_text || '%')
  ), data_cte AS (
    SELECT
      bg.id,
      bg.title,
      bg.description
    FROM blog bg
    WHERE (p_search_text IS NULL OR bg.title ILIKE '%' || p_search_text || '%')
    ORDER BY bg.title ASC
    OFFSET p_offset
    LIMIT p_limit
  )
  SELECT (SELECT count FROM row_count_cte) AS row_count, jsonb_agg(t) AS data
  FROM data_cte AS t;
END;
$function$;

-- insert blog
CREATE OR REPLACE FUNCTION create_fn_blog(
    new_title VARCHAR,
    new_description VARCHAR
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert data into the blog table
    INSERT INTO blog (title, description)
    VALUES (new_title, new_description);
END;
$$;

-- update blog
CREATE OR REPLACE FUNCTION update_fn_blog(
    blog_id UUID,
    new_title VARCHAR,
    new_description VARCHAR
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update data in the blog table
    UPDATE blog
    SET 
        title = new_title,
        description = new_description
    WHERE
        id = blog_id;
END;
$$;

-- delete blog
CREATE OR REPLACE FUNCTION delete_fn_blog(
    blog_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Delete data from the blogg table
    DELETE FROM blog
    WHERE
        id = blog_id;
END;
$$;

-- get roles
CREATE OR REPLACE FUNCTION get_fn_roles()
RETURNS TABLE (
    id UUID,
    name varchar
) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
      role.id, 
      role.name 
    FROM roles role;
END;
$$ LANGUAGE plpgsql;

-- create roles
CREATE OR REPLACE FUNCTION create_fn_roles_permissions(
    new_roles_name VARCHAR,
    new_selected_permissions UUID[],
    new_collect_path JSON[]
)
RETURNS VOID AS $$
DECLARE
    role_id UUID;
    permission_id UUID;
    path_data JSON;
BEGIN
    -- Insert data ke tabel roles dan dapatkan ID hasil insertnya
    INSERT INTO roles (name)
    VALUES (new_roles_name)
    RETURNING id INTO role_id;

    -- Loop untuk setiap permission yang dipilih
    FOREACH permission_id IN ARRAY new_selected_permissions LOOP
        -- Insert ke tabel role_permissions
        INSERT INTO role_permissions (role_id, permission_id)
        VALUES (role_id, permission_id);
    END LOOP;

    -- Loop untuk setiap path yang dikumpulkan
    FOR path_data IN SELECT * FROM unnest(new_collect_path) LOOP
        -- Insert ke tabel role_menu_permissions
        INSERT INTO role_menu_permissions (role_id, menu_item_id, path)
        VALUES (role_id, (path_data->>'value')::UUID, path_data->>'label');
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- update roles
CREATE OR REPLACE FUNCTION update_fn_roles(
    p_role_id UUID,
    p_role_name VARCHAR,
    p_added_path JSON[],
    p_removed_path JSON[],
    p_added_permission JSON[],
    p_removed_permission JSON[]
) RETURNS VOID AS $$
DECLARE
    path_added_data JSON;
    removed_path_data JSON;
    permission_added_data JSON;
    permission_removed_data JSON;
BEGIN
    -- Mulai transaksi
    -- Update name di table roles
    UPDATE roles
    SET name = p_role_name
    WHERE id = p_role_id;

    -- Insert data baru ke dalam table role_menu_permissions
    FOREACH path_added_data IN ARRAY p_added_path
    LOOP
        INSERT INTO role_menu_permissions (role_id, menu_item_id, path)
        VALUES (p_role_id, (path_added_data->>'value')::UUID, path_added_data->>'label');
    END LOOP;

    -- Delete data yang dihapus dari table role_menu_permissions
    FOREACH removed_path_data IN ARRAY p_removed_path
    LOOP
        DELETE FROM role_menu_permissions
        WHERE role_id = p_role_id
        AND menu_item_id = (removed_path_data->>'value')::UUID
        AND path = removed_path_data->>'label';
    END LOOP;

    -- Insert data baru ke dalam table role_permissions
    FOREACH permission_added_data IN ARRAY p_added_permission
    LOOP
        INSERT INTO role_permissions (role_id, permission_id)
        VALUES (p_role_id, (permission_added_data->>'id')::UUID);
    END LOOP;

    -- Delete data yang dihapus dari table role_permissions
    FOREACH permission_removed_data IN ARRAY p_removed_permission
    LOOP
        DELETE FROM role_permissions
        WHERE role_id = p_role_id
        AND permission_id = (permission_removed_data->>'id')::UUID;
    END LOOP;

    -- Commit transaksi
    EXCEPTION
    WHEN OTHERS THEN
      -- Rollback transaksi jika terjadi kesalahan
      ROLLBACK;
      RAISE;
END;
$$ LANGUAGE plpgsql;

-- delete roles
CREATE OR REPLACE FUNCTION delete_fn_roles(
    p_role_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    user_count INTEGER;
BEGIN
    -- Check if there are any users associated with the role
    SELECT COUNT(*) INTO user_count
    FROM users
    WHERE role_id = p_role_id;

    IF user_count > 0 THEN
        RAISE EXCEPTION 'Deletion failed because there are still users associated with this role.';
    ELSE
        -- Delete data from role_menu_permissions by role_id
        DELETE FROM role_menu_permissions
        WHERE role_id = p_role_id;

        -- Delete data from role_permissions by role_id
        DELETE FROM role_permissions
        WHERE role_id = p_role_id;

        -- Delete data from roles table by id
        DELETE FROM roles
        WHERE id = p_role_id;
    END IF;
END;
$$;

-- get users
CREATE OR REPLACE FUNCTION public.get_fn_users(
  p_limit INTEGER,
  p_offset INTEGER,
  p_search_text TEXT
)
RETURNS TABLE(row_count BIGINT, data JSONB)
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  WITH row_count_cte AS (
    SELECT COUNT(*) AS count
    FROM users
    JOIN roles ON users.role_id = roles.id
    WHERE (p_search_text IS NULL OR users.name ILIKE '%' || p_search_text || '%')
  ), data_cte AS (
    SELECT
      u.id,
      u.name,
      u.photo,
      u.email,
      u.password,
      r.id AS role_id,
      r.name AS role_name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE (p_search_text IS NULL OR u.name ILIKE '%' || p_search_text || '%')
    ORDER BY u.name ASC
    OFFSET p_offset
    LIMIT p_limit
  )
  SELECT (SELECT count FROM row_count_cte) AS row_count, jsonb_agg(t) AS data
  FROM data_cte AS t;
END;
$function$;

-- create users
CREATE OR REPLACE FUNCTION create_fn_users(
    new_full_name VARCHAR,
    new_email VARCHAR,
    new_password VARCHAR,
    new_photo VARCHAR,
    new_role_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert data into the users table
    INSERT INTO users (name, email, password, photo, role_id)
    VALUES (new_full_name, new_email, new_password, new_photo, new_role_id);
END;
$$;

-- update users
CREATE OR REPLACE FUNCTION update_fn_users(
    user_id UUID,
    new_full_name VARCHAR,
    new_email VARCHAR,
    new_password VARCHAR,
    new_photo VARCHAR,
    new_role_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update data in the users table
    UPDATE users
    SET 
        name = new_full_name,
        email = new_email,
        password = new_password,
        photo = new_photo,
        role_id = new_role_id
    WHERE
        id = user_id;
END;
$$;

-- delete users
CREATE OR REPLACE FUNCTION delete_fn_users(
    user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Delete data from the users table
    DELETE FROM users
    WHERE
        id = user_id;
END;
$$;

-- show data  table roles permmissions
CREATE OR REPLACE FUNCTION get_role_permissions_list()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(role_data)
    INTO result
    FROM (
        SELECT
            roles.id AS role_id,
            roles.name AS role_name,
            (
                SELECT json_agg(user_data)
                FROM (
                    SELECT
                        id AS user_id,
                        name AS user_name,
                        photo
                    FROM users
                    WHERE users.role_id = roles.id
                    ORDER BY photo ASC
                    LIMIT 5
                ) AS user_data
            ) AS users,
            (
                SELECT CASE WHEN COUNT(*) > 5 THEN COUNT(*) - 5 ELSE 0 END
                FROM users
                WHERE users.role_id = roles.id
            ) AS remaining_users,
            (
                SELECT json_agg(json_build_object('value', role_menu_permissions.menu_item_id, 'label', role_menu_permissions.path))
                FROM role_menu_permissions
                WHERE role_menu_permissions.role_id = roles.id
            ) AS menu_permissions,
            (
                SELECT json_agg(json_build_object('id', role_permissions.permission_id, 'name', permissions.name))
                FROM role_permissions
                JOIN permissions ON role_permissions.permission_id = permissions.id
                WHERE role_permissions.role_id = roles.id
            ) AS role_permissions
        FROM roles
    ) AS role_data;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- get menu path permissions
CREATE OR REPLACE FUNCTION get_fn_path()
RETURNS JSONB AS $$
DECLARE
    menu_items JSONB;
    menu_sub_items JSONB;
    result JSONB;
BEGIN
    -- Ambil data dari tabel menu_item
    SELECT json_agg(jsonb_build_object('value', id, 'label', path))
    INTO menu_items
    FROM menu_item;

    -- Ambil data dari tabel menu_sub_item
    SELECT json_agg(jsonb_build_object('value', id, 'label', path))
    INTO menu_sub_items
    FROM menu_sub_item;

    -- Gabungkan data dari kedua tabel
    result := menu_items || menu_sub_items;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- get permissions
CREATE OR REPLACE FUNCTION get_permission()
RETURNS TABLE (
    id UUID,
    name varchar
) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
      perm.id, 
      perm.name 
    FROM permissions perm;
END;
$$ LANGUAGE plpgsql;

-- get menu sidebar with access roles
CREATE OR REPLACE FUNCTION get_fn_menu_permission(p_id UUID)
RETURNS TABLE(
    menutitle VARCHAR,
    items JSON
) AS $$
BEGIN
    RETURN QUERY
    WITH accessible_items AS (
        SELECT 
            DISTINCT mi.menu_id, -- Gunakan DISTINCT untuk memastikan setiap menu_id unik
            mi.id,
            mi.path,
            mi.icon,
            mi.type,
            mi.active,
            mi.selected,
            mi.title,
            mi.position
        FROM 
            menu_item mi
            JOIN role_menu_permissions rmp ON rmp.menu_item_id = mi.id
        WHERE 
            rmp.role_id = p_id
    ),
    accessible_sub_items AS (
        SELECT 
            msi.menu_item_id,
            msi.path,
            msi.type,
            msi.active,
            msi.selected,
            msi.title,
            msi.position
        FROM 
            menu_sub_item msi
            JOIN role_menu_permissions rmp ON rmp.menu_item_id = msi.id
        WHERE 
            rmp.role_id = p_id
    )
    SELECT 
        m.menutitle,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'path', ai.path,
                'icon', ai.icon,
                'type', ai.type,
                'active', ai.active,
                'selected', ai.selected,
                'title', ai.title,
                'children', (
                    SELECT JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'path', asi.path,
                            'type', asi.type,
                            'active', asi.active,
                            'selected', asi.selected,
                            'title', asi.title
                        ) ORDER BY asi.position
                    )
                    FROM accessible_sub_items asi
                    WHERE asi.menu_item_id = ai.id
                )
            ) ORDER BY ai.position
        ) AS items
    FROM 
        menu m
        JOIN accessible_items ai ON m.id = ai.menu_id
    GROUP BY m.id, m.menutitle
    ORDER BY m.position; -- Pastikan menu diurutkan berdasarkan position
END;
$$ LANGUAGE plpgsql;

