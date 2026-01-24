import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
   const user={name:"vyshnavi"}
   const navigate=useNavigate()
   const logoutUser=()=>{
      navigate('/')

   }
  return (
    <div className="shadow bg-white">
      <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
      <Link>
      <img src="/logo.svg" alt="Logo" className="h-11"/>
      </Link>
      <div className='flex items-center gap-4 text-sm'>
         <p className='max-sm:hidden'>Hi,{user?.name}</p>
         <button  onClick={logoutUser}className="bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all">Logout</button>
      </div>
      </nav>
    </div>
  )
}

export default Navbar