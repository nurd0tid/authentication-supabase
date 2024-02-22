import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
const axios = require('axios');

import {
  MdDashboard,
  MdLogout,
  MdNotes,
  MdMenu,
  MdOutlineSupervisedUserCircle,
  MdOutlineVerifiedUser,
} from 'react-icons/md';
import { usePathname } from 'next/navigation'; // Assuming usePathname is correctly imported from 'next/navigation'
import { Image } from 'react-bootstrap';

const menuItems = [
  {
    title: 'Pages',
    list: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <MdDashboard />,
      },
      {
        title: 'Blog',
        path: '/blog',
        icon: <MdNotes />,
      },
    ],
  },
  {
    title: 'Management',
    list: [
      {
        title: 'Group Features',
        path: '/features/group',
        icon: <MdMenu />,
      },
      {
        title: 'Features',
        path: '/features',
        icon: <MdMenu />,
      },
      {
        title: 'Roles',
        path: '/roles',
        icon: <MdOutlineSupervisedUserCircle />,
      },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState(null);

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
          <span className="sidebar-userTitle">{userData?.sud}</span>
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
                {item.icon}
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
