import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const cookie = req.cookies.currentUser;
  
  if (!cookie) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { accessToken } = JSON.parse(cookie);

  try {
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

    const { sun, sud, sur, role } = decodedToken;

    // Di sini Anda dapat menambahkan logika lain yang diperlukan, seperti mendapatkan data tambahan dari basis data, dll.

    return res.status(200).json({ sun, sud, sur, role });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
