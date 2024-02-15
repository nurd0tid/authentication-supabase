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

      const isValidToken = await verifyToken(res, accessToken);

      if (isValidToken) {
        const { id } = req.body; // Mengambil id dari request body untuk menghapus entri yang sesuai

        const { data, error } = await supabase
          .from('blog')
          .delete() // Menggunakan metode delete untuk menghapus data
          .eq('id', id); // Menghapus data dengan id yang sesuai

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
