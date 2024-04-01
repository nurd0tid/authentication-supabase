import supabase from "../../../../supabase";
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
        const thread = await openai.beta.threads.create();

        const { room_by, sender_name, assistant_id, reciver_name, } = req.body;

        const { data, error } = await supabase.rpc('create_fn_chat', {
          new_room_by: room_by,
          new_assistants_id: assistant_id,
          new_thread_id: thread.id,
          new_reciver: null,
          new_reciver_name: reciver_name,
          new_reciver_photo: null,
          new_last_message: `Hey, ${sender_name} 👋<br/> Saya Legalnowy, asisten AI pribadi Anda. Mari mulai dengan memilih topik atau sampaikan permintaan Anda.<br/> Apakah ada yang bisa saya bantu hari ini?`,
          new_role: 'assistant',
          new_content: `Hey, ${sender_name} 👋<br/> Saya Legalnowy, asisten AI pribadi Anda. Mari mulai dengan memilih topik atau sampaikan permintaan Anda.<br/> Apakah ada yang bisa saya bantu hari ini?`,
          new_type_chat: 'text',
          new_command_type: 0
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
