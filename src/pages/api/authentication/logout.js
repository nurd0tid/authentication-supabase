export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Hapus cookie currentUser dari header permintaan
    res.setHeader('Set-Cookie', 'currentUser=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly');

    // Berikan respons bahwa logout berhasil
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
