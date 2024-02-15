import supabase from '../../../../supabase';
import { verify } from 'jsonwebtoken';

export default async function verifyToken(res, accessToken) {
  try {
    const { data, error } = await supabase.from('blacklist').select().eq('token_blacklist', accessToken);

    if (error) {
      console.error(error);
    }

    if (data.length > 0) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const isValidToken = verify(accessToken, process.env.JWT_SECRET);
    if (isValidToken) {
      return true;
    } else {
      return false; 
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}
