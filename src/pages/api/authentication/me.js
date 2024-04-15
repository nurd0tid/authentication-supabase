// import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';

export default async function handler(req, res) {
  const cookie = req.cookies.currentUser;
  
  if (!cookie) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { accessToken } = JSON.parse(cookie);

  try {
    // const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    const key = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload: decodedToken } = await jwtVerify(accessToken, key, {
      algorithms: ['HS256'] // Menyertakan algoritma yang digunakan
    });

    const { sun, sud, sur, role, photo, group_id } = decodedToken;
    let data;

    if (role === 'Users') {
      data = { sun, sud, sur, role, photo };
    } else {
      data = { sun, sud, sur, role, photo, group_id };
    }

    // Di sini Anda dapat menambahkan logika lain yang diperlukan, seperti mendapatkan data tambahan dari basis data, dll.

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
