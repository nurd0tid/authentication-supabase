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
        const { text, sender, sender_name, sender_photo, bot_name, bot_photo, room_id } = req.body;

        // Insert original message into Supabase
        const { data: insertedMessage, error } = await supabase.rpc('create_fn_send_message_bot', {
          new_thread_room_id: room_id,
          new_content: text,
          new_role: sender,
          new_type_chat: 'text',
          new_sender_name: sender_name,
          new_sender_photo: sender_photo
        });

        if (error) throw new Error(error.message);

        res.status(200).json({ message: 'Successfully sending message!' });

        // Insert original message into Supabase
        const { data: insertedMessageSystem, errorSystem } = await supabase.rpc('create_fn_send_message_bot_reply', {
          new_thread_room_id: room_id,
          new_content: 'Berikut topik yang sudah kami rangkum. Dari opsi dibawah ini, kamu dapat memilih nya ya.',
          new_role: 'system',
          new_type_chat: 'text',
          new_command_show: true,
          new_initial_command: 0,
          new_sender_name: bot_name,
          new_sender_photo: bot_photo
        });

        if (error) throw new Error(errorSystem.message);
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
