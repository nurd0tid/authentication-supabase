import React from 'react'
import Rightbar from '../../../components/dashboard/Rightbar'

function Dashboard() {
  return (
    <div className='wrapper'>
      <div className='main'>
        <div className='cards'>

        </div>
      </div>
      <div className='side'>
        <Rightbar/>
      </div>
    </div>
  )
}

Dashboard.layout = 'MainLayout'
export default Dashboard