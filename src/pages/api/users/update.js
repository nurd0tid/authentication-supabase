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
        const { full_name, email, password, photo, role_id, id } = req.body;

        const { data, error } = await supabase.rpc('update_fn_users', {
          user_id: id,
          new_full_name: full_name,
          new_email: email,
          new_password: password,
          new_photo: photo,
          new_role_id: role_id
        });

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
