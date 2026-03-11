import React from 'react'
import Hero from '../components/Hero'
import TrendingProducts from '../components/TrendingProducts'
import PromotionalBanner from '../components/PromotionalBanner'
import ShopByCategories from '../components/ShopByCategories'
import PetLoverProducts from '../components/PetLoverProducts'
import PromoCards from '../components/PromoCards'
import BestiesGiftsProducts from '../components/BestiesGiftsProducts'
import Features from '../components/Features'
import InstagramGallery from '../components/InstagramGallery'

const Home = () => {
  return (
    <div>
      <Hero />
      <TrendingProducts />
      <PromotionalBanner />
      <ShopByCategories />
      <PetLoverProducts />
      <PromoCards />
      <BestiesGiftsProducts />
      <Features />
      <InstagramGallery />
    </div>
  )
}

export default Home