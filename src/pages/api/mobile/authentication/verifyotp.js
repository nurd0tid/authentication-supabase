import supabase from '../../../../supabase';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, otp } = req.body;

  try {
    // Fetch user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(400).json({ message: 'Invalid email or OTP' });
    }

    // Check if OTP matches
    if (user.otp_code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Clear OTP from user's record
    await supabase
      .from('users')
      .update({ otp_code: null, revoked_mobile: false })
      .eq('email', email);

    // Create JWT token
    const token = jwt.sign(
      { sun: user.name, sud: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );

    return res.status(200).json({ 
      statusCode: 200,
      message: 'OTP verified successfully',
      accessToken: token,
      expiresAt: new Date(Date.now() + 6 * 3600000).toISOString(),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
