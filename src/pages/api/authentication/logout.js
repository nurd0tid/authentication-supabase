import supabase from "../../../../supabase";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const cookie = req.cookies.currentUser;
    
    // Ambil accessToken dari cookie
    const { accessToken } = JSON.parse(cookie);

    // Masukkan accessToken ke dalam blacklist
    const { data, error } = await supabase.from('blacklist').insert({ token_blacklist: accessToken });
    if (error) {
      throw error;
    }

    // Hapus cookie currentUser dari header permintaan setelah menyimpan accessToken ke dalam blacklist
    res.setHeader('Set-Cookie', 'currentUser=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly');

    // Berikan respons bahwa logout berhasil
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
