import React from 'react'
import Image from 'next/image'

const AuthHeader = ({ activeTab, headerText = null }) => {
  return (
    <div className='flex flex-col items-center'>
      <Image
        src='/Assets/Techgrid.svg'
        alt='TechGrid Logo'
        width={"60"}
        height={"60"}
        className='mb-2'
        loading='lazy'
      ></Image>
      {
        headerText === null && <> <h2 className='text-center text-xl font-medium  capitalize'>{activeTab} to TeachGrid</h2>
          <p className='text-center text-sm font-light'>Effortless Learning, Connected Education.</p> </>
      }

    </div>
  )
}

export default AuthHeader