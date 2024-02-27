import supabase from "../../../../supabase";

// Contoh fungsi checkPermission yang diperbaiki
async function checkPermission(roleId, featurePath, permissionName) {
  try {
    // Pertama, dapatkan feature_id berdasarkan path
    const { data: featureData, error: featureError } = await supabase
      .from('features')
      .select('id')
      .eq('path', featurePath)
      .single(); // Asumsikan path unik, gunakan .single() untuk mendapatkan satu objek langsung

    if (featureError || !featureData) {
      console.error(featureError);
      return false; // Jika tidak ada feature yang cocok, tidak perlu melanjutkan
    }

    // Kedua, dapatkan permission_id berdasarkan name
    const { data: permissionData, error: permissionError } = await supabase
      .from('permissions')
      .select('id')
      .eq('name', permissionName)
      .single(); // Asumsikan name unik

    if (permissionError || !permissionData) {
      console.error(permissionError);
      return false; // Jika tidak ada permission yang cocok, tidak perlu melanjutkan
    }

    // Ketiga, cek apakah ada role_feature_permission yang cocok
    const { data: permissionCheckData, error: permissionCheckError } = await supabase
      .from('role_feature_permissions')
      .select('*')
      .eq('role_id', roleId)
      .eq('feature_id', featureData.id)
      .eq('permission_id', permissionData.id);

    if (permissionCheckError) {
      console.error(permissionCheckError);
      return false;
    }

    // Jika ada data yang cocok, berikan akses
    return permissionCheckData.length > 0;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

export default checkPermission;