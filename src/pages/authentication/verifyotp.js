import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function VerifyOtp() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/authentication/verifyotp', {
        email: router.query.email,
        otp: otp.trim(),
      });
      if (response.status === 200) {
        // OTP verified successfully, redirect to dashboard or home page
        router.push('/dashboard'); // Change this to the appropriate redirect path
      }
    } catch (error) {
      setError('Invalid OTP');
    }
  };

  return (
    <div>
      <h1>Verify OTP</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="otp">OTP:</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}
