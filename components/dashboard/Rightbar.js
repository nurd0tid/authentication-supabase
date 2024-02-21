import React from 'react'
import { Image } from 'react-bootstrap';
import { MdPlayCircleFilled, MdReadMore } from "react-icons/md";

function Rightbar() {
  return (
    <div className='rightbar'>
      <div className='rightbar-item'>
        <div className='rightbar-bgContainer'>
          <Image className='rightbar-bg' src="/assets/astronaut.png" alt="astronout" fluid />
        </div>
        <div className='rightbar-text'>
          <span className='rightbar-notification'>🔥 Available Now</span>
          <h5 className='rightbar-title'>
            How to use the new version of the admin dashboard?
          </h5>
          <span className='rightbar-subtitle'>Takes 4 minutes to learn</span>
          <p className='rightbar-desc'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Reprehenderit eius libero perspiciatis recusandae possimus.
          </p>
          <button className='rightbar-button'>
            <MdPlayCircleFilled />
            Watch
          </button>
        </div>
      </div>
      <div className='rightbar-item'>
        <div className='rightbar-text'>
          <span className='rightbar-notification'>🚀 Coming Soon</span>
          <h5 className='rightbar-title'>
            New server actions are available, partial pre-rendering is coming
            up!
          </h5>
          <span className='rightbar-subtitle'>Boost your productivity</span>
          <p className='rightbar-desc'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Reprehenderit eius libero perspiciatis recusandae possimus.
          </p>
          <button className='rightbar-button'>
            <MdReadMore />
            Learn
          </button>
        </div>
      </div>
    </div>
  )
}

export default Rightbar