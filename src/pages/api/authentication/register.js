import bcrypt from 'bcryptjs';
import supabase from '../../../../supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, password } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke database
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword }]);

    if (error) {
      console.log(error)
      return res.status(500).json({ message: 'Failed to register user' });
    }

    res.status(200).json({ message: 'Registration successfuly' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
