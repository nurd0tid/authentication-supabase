import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
const axios = require('axios');

import {
  MdLogout
} from 'react-icons/md';
import { usePathname } from 'next/navigation'; // Assuming usePathname is correctly imported from 'next/navigation'
import { Image } from 'react-bootstrap';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  // Fetching Me
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/authentication/me');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  // Fetching Features
  useEffect(() => {
    const fetchFeatures = async () => {
      if (userData) {
        const sur = userData?.sur;
        try {
          const response = await axios.post('/api/features/get', {
            sur: sur,
          });
          setMenuItems(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchFeatures();
  }, [userData]);

  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/authentication/logout');

      if (response.status === 200) {
        router.push('/authentication/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-user">
        <Image
          className="sidebar-userImage"
          src={'/assets/noavatar.png'}
          alt="profile"
          width="50"
          height="50"
        />
        <div className="sidebar-userDetail">
          <span className="sidebar-username">{userData?.sun}</span>
          <span className="sidebar-userTitle">{userData?.role}</span>
        </div>
      </div>
      <ul className="sidebar-list">
        {menuItems.map((cat, index) => (
          <li key={index}>
            <span className="sidebar-cat">{cat.title}</span>
            {cat.list.map((item) => (
              <a
                key={item.title}
                href={item.path}
                className={`sidebar-link ${pathname === item.path && 'active'}`}
              >
                <i className={item.icon}></i>
                {item.title}
              </a>
            ))}
          </li>
        ))}
      </ul>
      <button className="sidebar-logout" onClick={handleLogout}>
        <MdLogout />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
