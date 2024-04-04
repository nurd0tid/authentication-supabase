import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CommandInChatSingle(props) {
  const [data, setData] = useState([]);
  const {
    commandId,
    roomId,
    setIsTyping 
  } = props

  // Function Show Data
  useEffect(() => {     
      const fetchData = async () => {
        try {
          const response = await axios.get('/api/chat/cmd/single', {
            params: {
              id: commandId
            }
          });
          if (response.status === 201) {
            setData(response.data[0]);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchData();
  }, []);

  const clickCommand = async (text, sender, cmdId) => {
    try {
      setIsTyping(true);
      const response = await axios.post('/api/chat/sendcmd', { 
        text: text, 
        sender: sender, 
        room_id: roomId,
        command_id:  cmdId
      });
      if (response.status === 200) {
        setIsTyping(false);
        toast.success(response.data.message);
      }
    } catch (error) {
      setIsTyping(false);
      toast.error(error.response.data.message);
    }
  }

  return (
    <div>
      <div className='btn-list mt-4'>
        <Link href="#!" className="btn btn-outline-primary btn-sm" onClick={() => clickCommand(data?.title, 'user', data?.id)}>{data?.title}</Link>
      </div>
    </div>
  )
}

export default CommandInChatSingle