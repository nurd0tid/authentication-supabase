import supabase from "../../../../../supabase";
import checkPermission from "@/pages/utils/auth/checkPermission";
import verifyToken from "@/pages/utils/auth/verifyToken";
import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    try {
      const cookie = req.cookies.currentUser;

      if (!cookie) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { accessToken } = JSON.parse(cookie);

      const { isValid, roleId } = await verifyToken(accessToken);

      if (isValid) {
        const { room_id, status, sender_name, bot_name, bot_photo } = req.body;

        if (status) {
          const thread = await openai.beta.threads.create();

          const { data: insertedMessage, error } = await supabase.rpc('create_fn_assign_livechat_ready', {
            new_thread_id: thread.id,
            new_thread_room_id: room_id,
            new_content: `Hey, ${sender_name} 👋.<br/>
            Tunggu sebentar yah, Legalnowy akan menghubungkan kamu ke Agent legalnowy?`,
            new_role: 'system',
            new_type_chat: 'text',
            new_sender_name: bot_name,
            new_sender_photo: bot_photo,
          });
          if (error) throw new Error(error.message);
          console.log(error)

          res.status(200).json(insertedMessage);
        } else {
          const { data: insertedMessage, error } = await supabase.rpc('create_fn_assign_livechat_not_ready', {
            new_thread_room_id: room_id,
            new_content: 'Yahh, sepertinya kamu tidak mempunyai **credit** yang tersedia nih, sehingga kamu tidak dapat menggunakan fitur **Live Chat** ini, ingin tahu cara nya mengisi credit kamu? klik tombol bantuan ya 😁',
            new_role: 'system',
            new_type_chat: 'text',
            new_command_show: true,
            new_command_id: 'a2123a45-9838-4a9e-b28c-e03c4fac62a4',
            new_initial_command: 2,
            new_sender_name: bot_name,
            new_sender_photo: bot_photo,
          });

          if (error) throw new Error(error.message);
          
          res.status(201).json({ message: 'Ok!' });
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
