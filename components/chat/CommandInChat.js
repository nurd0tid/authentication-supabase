import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CommandInChat(props) {
  const [data, setData] = useState([]);
  const {
    roomId,
    setIsTyping 
  } = props

  // Function Show Data
  useEffect(() => {     
      const fetchData = async () => {
        try {
          const response = await axios.get('/api/chat/command');
          if (response.status === 201) {
            setData(response.data);;
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchData();
  }, []);

  const clickCommand = async (text, sender, commandId) => {
    try {
      setIsTyping(true);
      const response = await axios.post('/api/chat/sendcmd', { 
        text: text, 
        sender: sender, 
        room_id: roomId,
        command_id:  commandId
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
        {data.map((cmd, index) => (
            <Link href="#!" className="btn btn-outline-primary btn-sm" onClick={() => clickCommand(cmd.title, 'user', cmd.id)} key={index}>{cmd.title}</Link>
        ))}
      </div>
      <p className='mt-4'>Tidak puas dengan opsi yang ada? kamu dapat menanyakan secara langsung dengan memilih fitur <b>Live Chat</b> ataupun <b>Chat Assistant</b></p>
    </div>
  )
}

export default CommandInChat