import React, { useRef, useState } from 'react';

function ListCommand(props) {
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
        <span href='#' className='btn btn-outline-primary btn-sm'>Bantuan</span>
        <span href='#' className='btn btn-outline-primary btn-sm'>Live Chat</span>
        <span href='#' className='btn btn-outline-primary btn-sm'>Chat Assistant</span>
        <span href='#' className='btn btn-outline-primary btn-sm'>Lorem Ipsum</span>
        <span href='#' className='btn btn-outline-primary btn-sm'>Lorem Ipsum</span>
        <span href='#' className='btn btn-outline-primary btn-sm'>Lorem Ipsum</span>
        <span href='#' className='btn btn-outline-primary btn-sm'>Lorem Ipsum</span>
        <span href='#' className='btn btn-outline-primary btn-sm'>Lorem Ipsum</span>
        <span href='#' className='btn btn-outline-primary btn-sm'>Lorem Ipsum</span>
        <span href='#' className='btn btn-outline-primary btn-sm'>Lorem Ipsum</span>
        <span href='#' className='btn btn-outline-primary btn-sm'>Lorem Ipsum</span>
        <span href='#' className='btn btn-outline-primary btn-sm'>Lorem Ipsum</span>
      </div>
    </div>
  );
}

export default ListCommand;
