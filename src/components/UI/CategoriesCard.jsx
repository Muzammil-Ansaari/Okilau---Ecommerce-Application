import React from 'react'
import { assets } from '../../assets/assets'

const CategoriesCard = ({category}) => {
  return (
    <div className='flex flex-col gap-3 items-center cursor-pointer'>
        <div className='w-72 h-72 sm:w-60 sm:h-60 md:w-40 md:h-40 overflow-hidden'>
            <img className='w-full h-full hover:scale-110 transition-all duration-300' src={category.image} alt="Mugs" />
        </div>
        <p className='uppercase text-base font-medium'>{category.title}</p>
    </div>
  )
}

export default CategoriesCard