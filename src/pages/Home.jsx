import React from 'react'
import Hero from '../components/Hero'
import TrendingProducts from '../components/TrendingProducts'
import PromotionalBanner from '../components/PromotionalBanner'
import ShopByCategories from '../components/ShopByCategories'
import PetLoverProducts from '../components/PetLoverProducts'

const Home = () => {
  return (
    <div>
      <Hero />
      <TrendingProducts />
      <PromotionalBanner />
      <ShopByCategories />
      <PetLoverProducts />
    </div>
  )
}

export default Home