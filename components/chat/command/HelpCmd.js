import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link';

function HelpCmd(props) {
  const [data, setData] = useState([]);
  const {
    commandId,
    roomId,
    setIsTyping,
    userData,
    reciverName,
    reciverPhoto
  } = props

  // Function Show Data
  useEffect(() => {     
      const fetchData = async () => {
        try {
          const response = await axios.get('/api/chat/cmd/get/help', {
            params: {
              id: commandId
            }
          });
          if (response.status === 200) {
            setData(response.data[0]);
          }
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();
  }, []);

  const clickCommand = async (text, sender, cmdId) => {
    try {
      setIsTyping(true);
      const response = await axios.post('/api/chat/cmd/sending/help', { 
        text: text, 
        sender: sender, 
        room_id: roomId,
        command_id:  cmdId,
        sender_name: userData?.sun,
        sender_photo: userData?.photo,
        bot_name: reciverName,
        bot_photo: reciverPhoto
      });
      if (response.status === 200) {
        setIsTyping(false);
        console.log(response.data.message);
      }
    } catch (error) {
      setIsTyping(false);
      console.error(error);
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

export default HelpCmd