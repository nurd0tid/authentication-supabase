import checkPermission from "@/pages/utils/auth/checkPermission";
import supabase from "../../../../supabase";
import verifyToken from "@/pages/utils/auth/verifyToken";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const cookie = req.cookies.currentUser;

      if (!cookie) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { accessToken } = JSON.parse(cookie);

      const { isValid, roleId } = await verifyToken(accessToken);

      if (isValid) {
        const { role_id, newName, newPath, removedPath, newPermission, removePermission } = req.body;

        const { data, error } = await supabase.rpc('update_fn_roles', {
            p_role_id: role_id,
            p_role_name: newName,
            p_added_path: newPath,
            p_removed_path: removedPath,
            p_added_permission: newPermission,
            p_removed_permission: removePermission
        })

        if (error) {
          throw error;
        }

        res.status(201).json({ message: 'Successfully updated' });
      } else {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
