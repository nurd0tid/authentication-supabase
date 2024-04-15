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
        const { text, sender, room_id, agent_response, sender_name, sender_photo, bot_name, bot_photo } = req.body;

        if (agent_response) {          
          // Insert original message into Supabase
          const { data: insertedMessage, error } = await supabase.rpc('create_fn_send_message_livechat_users', {
            new_thread_room_id: room_id,
            new_content: text,
            new_role: sender,
            new_type_chat: 'text',
            new_sender_name: sender_name,
            new_sender_photo: sender_photo
          });
  
          if (error) throw new Error(error.message);
  
          res.status(200).json({ message: 'Successfully sending message!' });
        } else {
          // Insert original message into Supabase
          const { data: insertedMessage, error } = await supabase.rpc('create_fn_send_message_livechat_users', {
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
          const { data: insertedMessageSystem, errorSystem } = await supabase.rpc('create_fn_send_message_livechat_users_reply', {
            new_thread_room_id: room_id,
            new_content: `Hey ${sender_name}, mohon bersabar yah.<br/>
            Legalnowy masih mencari agent untuk kamu, saat ini agent kami sedang melakukan chat dengan yang lain, tunggu sebentar ya. <br/><br/>
            Maaf atas ketidaknyamanan yang kamu rasakan.`,
            new_role: 'system',
            new_type_chat: 'text',
            new_sender_name: bot_name,
            new_sender_photo: bot_photo
          });
  
          if (error) throw new Error(errorSystem.message);
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
