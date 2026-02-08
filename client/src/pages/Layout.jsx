import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import{useSelector} from 'react-redux'
import Loader from '../components/Loader.jsx'
import Login from '../pages/Login.jsx'

const Layout = () => {
  const{user,loading}=useSelector(state=>state.auth)
  if(loading){
    return <Loader></Loader>
  }
  return (
    <div>
      {
        user ?(<div className='min-h-screen bg-gray-50'>
        <Navbar />
        <Outlet /></div>) : (
          <div className='min-h-screen bg-gray-50'>
            <Login></Login>
          </div>
        )
      }
    </div>
  )
}

export default Layout
