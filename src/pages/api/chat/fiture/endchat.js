import supabase from "../../../../../supabase";
import checkPermission from "@/pages/utils/auth/checkPermission";
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
        const { room_id, typeChat } = req.body;

        if (typeChat === 1) {
          const { data, error } = await supabase.rpc('create_fn_end_chat', {
            new_thread_room_id: room_id,
            new_content: `Terimakasih sudah menggunakan layanan Assistant dari **Legalnowy**.<br/>
            Saya harap setiap jawaban saya membantu kamu, jangan sungkan untuk bertanya lagi di lain waktu.
            `,
            new_role: 'system',
            new_type_chat: 'text'
          });
          if (error) throw new Error(error.message);

          res.status(200).json({
            type_chat: data.type_chat,
            message: 'Berhasil mengakhiri sesi chat!'
          });
        } else {
          const { data, error } = await supabase.rpc('create_fn_end_chat', {
            new_thread_room_id: room_id,
            new_content: `Terimakasih sudah menggunakan layanan Live Agent dari **Legalnowy**.<br/>
            Saya harap setiap jawaban saya membantu kamu, jangan sungkan untuk bertanya lagi di lain waktu.
            `,
            new_role: 'system',
            new_type_chat: 'text'
          });
          if (error) throw new Error(error.message);

          res.status(200).json({ 
            type_chat: data.type_chat,
            message: 'Berhasil mengakhiri sesi chat!'
          });
        }
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
