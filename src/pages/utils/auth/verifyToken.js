import supabase from '../../../../supabase';
import { verify } from 'jsonwebtoken';

export default async function verifyToken(res, accessToken) {
  try {
    const decodedToken = verify(accessToken, process.env.JWT_SECRET);
    const { sud } = decodedToken;

    const { data: blacklistData, error: blacklistError } = await supabase
      .from('blacklist')
      .select()
      .eq('token_blacklist', accessToken);

    if (blacklistError) {
      console.error(blacklistError);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (blacklistData.length > 0) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Set Revoked status
    const { data: authenticationData, error: authenticationError } = await supabase
      .from('authentication')
      .select('id, revoked_web')
      .eq('id', sud);

    if (authenticationError) {
      console.error(authenticationError);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (authenticationData.length === 0 || authenticationData[0].revoked_web === true) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
