import checkPermission from "@/pages/utils/auth/checkPermission";
import supabase from "../../../../../supabase";
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

      if (isValid && await checkPermission(roleId, '/features/group', 'Create')) {
        const { name, posision } = req.body;

        const { data, error } = await supabase
          .from('features_group')
          .insert([{ name, posision }])
          .select();

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
