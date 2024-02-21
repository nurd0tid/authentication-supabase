import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

function MainLayout({ children }) {
  return (
    <div className='container'>
      <div className='menu'>
        <Sidebar/>
      </div>
      <div className='content'>
        <Navbar/>
        {children}
      </div>
    </div>
  )
}

export default MainLayout