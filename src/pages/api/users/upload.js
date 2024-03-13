import supabase from '../../../../supabase'; // Sesuaikan dengan modul Supabase Anda
import multiparty from 'multiparty';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ message: 'Error parsing form data.' });
      }

      try {
        const photoFile = files.photo[0];
        const fileName = photoFile.originalFilename;
        const uuidFileName = uuidv4() + fileName.substring(fileName.lastIndexOf('.'));

        const photoBuffer = fs.readFileSync(photoFile.path);
      
        const { error } = await supabase.storage.from('users').upload(uuidFileName, photoBuffer, {
          contentType: `image/${fileName.split('.').pop()}`
        });

        if (error) {
          return res.status(400).json({ message: 'Error uploading photo to Supabase Storage.' });
        }

        // Menghapus file sementara yang diunggah
        fs.unlinkSync(photoFile.path);

        return res.status(200).json({ fileName: uuidFileName });
      } catch (error) {
        console.error('Error uploading photo:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
      }
    });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
