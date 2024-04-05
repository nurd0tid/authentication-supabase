import supabase from "../../../../supabase";
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

        const { room_by, sender_name, reciver_name, reciver_group, reciver_photo, assistant_id } = req.body;

        const { data, error } = await supabase.rpc('create_fn_chat', {
          new_room_by: room_by,
          new_assistant_id: assistant_id,
          new_reciver_name: reciver_name,
          new_reciver_group: reciver_group,
          new_reciver_photo: reciver_photo,
          new_last_message: `Hey, ${sender_name} 👋.<br/> Mari mulai dengan memilih topik atau sampaikan permintaan Anda.<br/> Apakah ada yang bisa saya bantu hari ini?`,
          new_role: 'system',
          new_content: `Hey, ${sender_name} 👋.<br/> Mari mulai dengan memilih topik atau sampaikan permintaan Anda.<br/> Apakah ada yang bisa saya bantu hari ini?`,
          new_type_chat: 'text',
          new_command_show: true,
          new_initial_command: 0,
        });

        if (error) {
          throw error;
        }

        res.status(201).json(data);
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
