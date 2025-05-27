import React from 'react'

const NavBar = () => {
  return (
    <div className='w-full h-[100px] bg-primary flex justify-between items-center px-10'>
        <div className='lg:w-[250px] flex items-center sm:w-[200px] h-[70px]'><img src='Qube.png' alt='Logo' /></div>
        <div className='lg:w-[200px] flex items-center sm:w-[100px] h-[70px] '>
            <button className='bg-yellow-300 text-black font-bold lg:w-1/2 h-2/3 text-[16px] sm:w-[70px] rounded-xl opacity-80'>Sign Up</button>
        </div>
    </div>
  )
}

export default NavBar;
