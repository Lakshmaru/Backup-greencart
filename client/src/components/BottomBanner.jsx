import React from 'react'
import { assets, features } from '../assets/assets'

const BottomBanner = () => {
  return (
    <div className='relative mt-24'>
      <img src={assets.bottom_banner_image} alt="banner" className='hidden w-full md:block' />
      <img src={assets.bottom_banner_image_sm} alt="banner" className='w-full md:hidden' />

      <div className='absolute inset-0 flex flex-col items-center pt-16 md:items-end md:justify-center md:pt-0 md:pr-24'>
        <div>
          <h1 className='font-semibold text-2x1 md:text-3xl text-primary md-6'>Why We Are the Best?</h1>
          {features.map((feature, index)=>(
            <div key={index} className='flex items-center gap-4 mt-2'> 
               <img src={feature.icon} alt={feature.title} className='md:w-11 w-9' />
               <div>
               <h3 className='text-lg md:text-xl font-semibolf'>{feature.title}</h3>
               <p className='text-xs text-gray-500/70 md:text-sm'>{feature.description}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  )
}

export default BottomBanner
