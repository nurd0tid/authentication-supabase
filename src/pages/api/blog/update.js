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

      const isValidToken = await verifyToken(res, accessToken);

      if (isValidToken) {
        const { title, description, id } = req.body; // Menambahkan id untuk keperluan update

        const { data, error } = await supabase
          .from('blog')
          .update({ title, description }) // Menggunakan metode update daripada insert
          .eq('id', id) // Menentukan kriteria untuk update (misalnya, ID)
          .single(); // Karena hanya update satu entitas, menggunakan single()

        if (error) {
          throw error;
        }

        res.status(201).json({ message: 'Successfully updated' }); // Mengubah status code menjadi 200 karena operasi update berhasil
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
