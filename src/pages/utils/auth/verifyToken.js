import { jwtVerify } from 'jose';
import supabase from '../../../../supabase';
// import { verify } from 'jsonwebtoken';

export default async function verifyToken(accessToken) {
  try {
    const key = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload: decodedToken } = await jwtVerify(accessToken, key, {
      algorithms: ['HS256'] // Menyertakan algoritma yang digunakan
    });
    const { sud, sur } = decodedToken;

    const { data: blacklistData, error: blacklistError } = await supabase
      .from('blacklist')
      .select()
      .eq('token_blacklist', accessToken);

    if (blacklistError) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (blacklistData.length > 0) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Set Revoked status
    const { data: authenticationData, error: authenticationError } = await supabase
      .from('users')
      .select('id, revoked_web')
      .eq('id', sud);

    if (authenticationError) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (authenticationData.length === 0 || authenticationData[0].revoked_web === true) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return {
      isValid: true,
      userId: sud, // atau `id` sesuai dengan data token Anda
      roleId: sur // Asumsikan Anda memiliki field role_id di users
    };
  } catch (error) {
    return { isValid: false };
  }
}
