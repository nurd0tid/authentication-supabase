import React, { useRef, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ListCmd(props) {
  const {
    typeChat,
    credit,
    roomId,
    userData,
    reciverName,
    reciverPhoto,
    setToThreadId,
    setTypeChat,
  } = props
  const [minimumCredit, setMinimumCredit] = useState(5);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startX;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleAssistant = async () => {
    const remainingCredit = credit - minimumCredit;
    const status = remainingCredit >= 0;
    const finalCredit = status ? remainingCredit : 0;

    try {     
      const response = await axios.post('/api/chat/fiture/ai', {
        room_id: roomId,
        status: status,
        credit: finalCredit,
        userId: userData?.sud,
        sender_name: userData?.sun,
        bot_name: reciverName,
        bot_photo: reciverPhoto
      });
      if (response.status === 200) {
        setToThreadId(response.data.thread_id)
        setTypeChat(response.data.type_chat);
        toast.success('Berhasil terhubung dengan Assistant.')
      }
    } catch (error) {
      toast.error('Something when wrong!')
    }
  }

  const handleEndChat = async () => {
    try {     
      const response = await axios.post('/api/chat/fiture/endchat', {
        room_id: roomId,
        typeChat: typeChat
      });
      if (response.status === 200) {
        setTypeChat(response.data.type_chat);
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error('Something when wrong!')
    }
  }

  return (
    <div
      ref={containerRef}
      className='btn-list-container'
      style={{
        overflowX: 'hidden',
        overflowY: 'hidden',
        whiteSpace: 'nowrap',
        maxWidth: '100%', // ubah sesuai kebutuhan
        borderBlockStart: '1px solid #e9edf4',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className='btn-list'
        style={{
          display: 'inline-block',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '10px',
          paddingBottom: '10px',
          maxHeight: '60px',
        }}
      >
        {typeChat !== 0 && (
          <span href='#' className='btn btn-outline-primary btn-sm' onClick={handleEndChat}>Akhiri Chat</span>
        )}
        <span href='#' className='btn btn-outline-primary btn-sm'>Topik</span>
        <span href='#' className='btn btn-outline-primary btn-sm'>Bantuan</span>
        <span href='#' className='btn btn-outline-primary btn-sm'>Live Chat</span>
        <span href='#' className='btn btn-outline-primary btn-sm' onClick={handleAssistant}>Chat Assistant</span>
      </div>
    </div>
  );
}

export default ListCmd;
