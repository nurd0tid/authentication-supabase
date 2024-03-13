import checkPermission from "@/pages/utils/auth/checkPermission";
import supabase from "../../../../supabase";
import verifyToken from "@/pages/utils/auth/verifyToken";

export default async function handler(req, res) {
  if (req.method === 'DELETE') { // Mengubah pengecekan metode menjadi DELETE
    try {
      const cookie = req.cookies.currentUser;

      if (!cookie) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { accessToken } = JSON.parse(cookie);

      const { isValid, roleId } = await verifyToken(accessToken);

      if (isValid) {
        const { id } = req.body;

        const { data, error } = await supabase.rpc('delete_fn_blog', {
          blog_id: id
        })

        if (error) {
          throw error;
        }

        res.status(201).json({ message: 'Successfully deleted' }); // Memberikan respons bahwa data berhasil dihapus
      } else {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']); // Mengizinkan hanya metode DELETE
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
