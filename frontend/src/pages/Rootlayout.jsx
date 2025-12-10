import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../component/Navbar'
import Footer from '../component/Footer'


export default function Rootlayout() {
  return (
    <div className='select-none'>



        <Navbar/>

        <Outlet/>
        <Footer/>
        

      
    </div>
  )
}
