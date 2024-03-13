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
        const { rolesName, selectedPermission, collectPath } = req.body;

        const { data, error } = await supabase.rpc('create_fn_roles_permissions', {
          new_roles_name: rolesName,
          new_selected_permissions: selectedPermission,
          new_collect_path: collectPath
        });

        if (error) {
          throw error;
        }

        res.status(201).json({ message: 'Successfully created' });
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
