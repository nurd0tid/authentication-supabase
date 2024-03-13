import supabase from "../../../../supabase";

async function checkPermission(p_id, menuItemPath, permissionName) {
  // try {
  //   // Pertama, dapatkan menu_item atau menu_sub_item berdasarkan path
  //   // Kita harus mencari di kedua tabel karena tidak tahu apakah path itu milik item atau sub-item
  //   let menuItemData = null;
  //   let menuItemError = null;

  //   // Cek di menu_item terlebih dahulu
  //   let { data: menuItem, error: menuItemErrorCheck } = await supabase
  //     .from('menu_item')
  //     .select('id')
  //     .ilike('path', menuItemPath) // Menggunakan ilike untuk case-insensitive match
  //     .single();

  //   if (menuItemErrorCheck);
  //   // console.error(menuItemErrorCheck);

  //   // Jika tidak ditemukan di menu_item, cek di menu_sub_item
  //   if (!menuItem) {
  //     const { data: menuSubItem, error: menuSubItemError } = await supabase
  //       .from('menu_sub_item')
  //       .select('id')
  //       .ilike('path', menuItemPath) // Menggunakan ilike untuk case-insensitive match
  //       .single();

  //     if (menuSubItem) {
  //       menuItemData = menuSubItem;
  //     }
  //     menuItemError = menuSubItemError;
  //   } else {
  //     menuItemData = menuItem;
  //   }

  //   // Jika tidak ada menu item atau sub item yang cocok, tidak perlu melanjutkan
  //   if (menuItemError || !menuItemData) {
  //     // console.error(menuItemError);
  //     return false;
  //   }

  //   // Kedua, dapatkan permission_id berdasarkan name
  //   const { data: permissionData, error: permissionError } = await supabase
  //     .from('permissions')
  //     .select('id')
  //     .eq('name', permissionName)
  //     .single(); // Asumsikan name unik

  //   if (permissionError || !permissionData) {
  //     // console.error(permissionError);
  //     return false; // Jika tidak ada permission yang cocok, tidak perlu melanjutkan
  //   }

  //   // Ketiga, cek apakah ada role_menu_permissions yang cocok
  //   const { data: permissionCheckData, error: permissionCheckError } = await supabase
  //     .from('role_menu_permissions')
  //     .select('*')
  //     .eq('role_id', p_id)
  //     .eq('menu_item_id', menuItemData.id)
  //     .eq('permission_id', permissionData.id);

  //   if (permissionCheckError) {
  //     // console.error(permissionCheckError);
  //     return false;
  //   }

  //   // Jika ada data yang cocok, berikan akses
  //   return permissionCheckData.length > 0;
  // } catch (error) {
  //   console.error('Error checking permission:', error);
  //   return false;
  // }
  return true
}

export default checkPermission;
