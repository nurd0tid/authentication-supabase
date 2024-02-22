import supabase from '../../../../../supabase';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { accessToken } = req.body;

  try {
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

    const { sud } = decodedToken;

    // Masukkan accessToken ke dalam blacklist
    const { data, error } = await supabase.from('blacklist').insert({ token_blacklist: accessToken });

    if (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Set Revoked status
    await supabase
    .from('users')
    .update({ revoked_mobile: true })
    .eq('id', sud);

    // Berikan respons bahwa logout berhasil
    return res.status(200).json({ 
      statusCode: 200,
      message: 'Logout successfuly'
    });

  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
