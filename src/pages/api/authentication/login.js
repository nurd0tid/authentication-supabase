import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../../../../supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    // Fetch user from Supabase
    const { data: user, error } = await supabase
      .from('authentication')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { sud: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );

    // Set cookie
    res.setHeader('Set-Cookie', `currentUser=${JSON.stringify({
      accessToken: token,
      expiresAt: new Date(Date.now() + 6 * 3600000).toISOString(), // 1 jam
    })}; Path=/; HttpOnly`);

    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
