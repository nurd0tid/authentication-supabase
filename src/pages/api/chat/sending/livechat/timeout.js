import supabase from "../../../../../../supabase";
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
        const { reciver, sender, sender_name, sender_photo, room_id } = req.body;

        // Insert original message into Supabase
        const { data: insertedMessage, error } = await supabase.rpc('create_fn_livechat_timeout', {
          new_thread_room_id: room_id,
          new_content: `Hey ${reciver}. <br/>Waktu live chat kamu sudah berakhir, terimakasih sudah menggunakan layanan live chat legalnowy.`,
          new_role: sender,
          new_type_chat: 'text',
          new_sender_name: sender_name,
          new_sender_photo: sender_photo
        });

        if (error) throw new Error(error.message);

        res.status(200).json(insertedMessage);
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
