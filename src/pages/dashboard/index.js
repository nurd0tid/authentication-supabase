import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/authentication/me');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Tambahkan penanganan kesalahan sesuai kebutuhan Anda
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/authentication/logout');

      if (response.status === 200) {
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {userData ? (
        <div>
          <p>Welcome, {userData.email}!</p>
          <p>Your user ID is: {userData.userId}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
