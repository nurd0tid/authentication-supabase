import supabase from "../../../../supabase";
// import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const cookie = req.cookies.currentUser;
    
    // Ambil accessToken dari cookie
    const { accessToken } = JSON.parse(cookie);
    // const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    const key = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload: decodedToken } = await jwtVerify(accessToken, key, {
      algorithms: ['HS256'] // Menyertakan algoritma yang digunakan
    });

    const { sud } = decodedToken;

    // Masukkan accessToken ke dalam blacklist
    const { data, error } = await supabase.from('blacklist').insert({ token_blacklist: accessToken });
    if (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Set Revoked status
    await supabase
    .from('users')
    .update({ revoked_web: true })
    .eq('id', sud);

    // Hapus cookie currentUser dari header permintaan setelah menyimpan accessToken ke dalam blacklist
    res.setHeader('Set-Cookie', 'currentUser=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly');

    // Berikan respons bahwa logout berhasil
    return res.status(200).json({ message: 'Logout successfuly' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
