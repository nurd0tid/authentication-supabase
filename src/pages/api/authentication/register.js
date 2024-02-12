import bcrypt from 'bcrypt';
import supabase from '../../../../supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke database
    const { data, error } = await supabase
      .from('authentication')
      .insert([{ email, password: hashedPassword }]);

    if (error) {
      console.error('Registration error:', error.message);
      return res.status(500).json({ message: 'Failed to register user' });
    }

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
