import checkPermission from "@/pages/utils/auth/checkPermission";
import supabase from "../../../../../../supabase";
import verifyToken from "@/pages/utils/auth/verifyToken";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const cookie = req.cookies.currentUser;

      if (!cookie) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { accessToken } = JSON.parse(cookie);
      
      const { isValid, roleId } = await verifyToken(accessToken);

      if (isValid) {
        const { id } = req.query;
        
        const { data, error } = await supabase.rpc('get_fn_category_cmd', {
            by_id: id
        });

        if (error) {
          throw error;
        }

        res.status(200).json(data);
      } else {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
