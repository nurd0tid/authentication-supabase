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
        const { sender, room_id, room_by, bot_name, bot_photo, minimum_credit } = req.body;

         // Calculate current time plus 15 minutes
        const currentTime = new Date();
        const futureTime = new Date(currentTime.getTime() + 15 * 60000); // 15 minutes in milliseconds

        // Get only time without date
        const futureTimeHours = futureTime.getHours();
        const futureTimeMinutes = futureTime.getMinutes();

        // Format time as HH:mm
        const futureTimeString = `${futureTimeHours.toString().padStart(2, '0')}:${futureTimeMinutes.toString().padStart(2, '0')}`;

          // Insert original message into Supabase
          const { data: insertedMessage, error } = await supabase.rpc('create_fn_send_livechat_response', {
            new_thread_room_id: room_id,
            new_room_by: room_by,
            new_content: `Kini kamu telah terhubung dengan agent live chat kami, silahkan tanyakan sesuatu hal yang kamu ingin ketahui.`,
            new_role: sender,
            new_type_chat: 'text',
            new_time_chat_agent: futureTimeString,
            new_sender_name: bot_name,
            new_sender_photo: bot_photo,
            new_minimum_credit: minimum_credit
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
