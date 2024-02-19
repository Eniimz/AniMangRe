import React from 'react'
import DashboardSidebar from '../components/DashboardSidebar'
import { DashboardProfile } from '../components/DashboardProfile'
import { useLocation } from 'react-router-dom'

function Dashboard() {

    const location = useLocation();
    
    const urlParams = new URLSearchParams(location.search)
    const activeTab = urlParams.get('tab')
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
    <div className='md:w-56'><DashboardSidebar /></div>

    {activeTab === 'profile' && <DashboardProfile />}
    </div>
  )
}

export default Dashboard