import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Faqs(props) {
  const [data, setData] = useState([]);
  const {
    commandId,
    roomId,
    setIsTyping 
  } = props

  // Function Show Data
  const fetchQuestion = async () => {
    try {
      if(commandId) {
        const response = await axios.get('/api/chat/faqs',  {
          params: {
            id: commandId
          }
        });
  
        if (response.status === 201) {
          setData(response.data)
        }
      }
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  // Fetching
  useEffect(() => {
    fetchQuestion();
  }, [commandId]);

  const clickCommand = async (text, sender, questionId) => {
    try {
      setIsTyping(true);
      const response = await axios.post('/api/chat/sendqs', { 
        text: text, 
        sender: sender, 
        room_id: roomId,
        question_id:  questionId
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        console.log(error)
        setIsTyping(false);
      }
    } catch (error) {
      toast.error(error);
      console.log(error)
      setIsTyping(false);
    }
  }

  return (
    <div>
      <div className='btn-list mt-4'>
        {data.map((qs, index) => (
          <Link href="#!" className="btn btn-outline-primary btn-sm" key={index} onClick={() => clickCommand(qs.question, 'user', qs.id)}>{qs.question}</Link>
        ))}
      </div>
      <p className='mt-4'>Tidak puas dengan opsi yang ada? kamu dapat menanyakan secara langsung kepada legalnowy dengan mengetikan pertanyaan loh.</p>
    </div>
  )
}

export default Faqs