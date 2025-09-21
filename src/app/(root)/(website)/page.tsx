import MainSlider from '@/components/Application/Website/MainSlider'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import banner1 from '../../../../public/assets/images/banner1.png'
import banner2 from '../../../../public/assets/images/banner2.png'
import FeaturedProducts from '@/components/Application/Website/FeaturedProducts'
import Advertisingbanner from '../../../../public/assets/images/advertising-banner.png'
import Testimonial from '@/components/Application/Website/Testimonial'
import { GiReturnArrow } from "react-icons/gi";
import { FaShippingFast } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { TbRosetteDiscountFilled } from "react-icons/tb";

const Home = () => {
  return (
    <>
      <section>
        <MainSlider />
      </section>
      <section className='lg:px-32 px-4 sm:pt-2 pt-5 pb-10 mt-5'>
        <div className='grid md:grid-cols-2 grid-cols-1 sm:gap-10 gap-2'>
          <div className='border rounded-lg overflow-hidden'>
            <Link href={''}>
              <Image
                src={banner1.src}
                width={banner1.width}
                height={banner1.height}
                alt='Banner 1'
                className='transition-all hover:scale-110'
              />
            </Link>
          </div>
          <div className='border rounded-lg overflow-hidden'>
            <Link href={''}>
              <Image
                src={banner2.src}
                width={banner2.width}
                height={banner2.height}
                alt='Banner 2'
                className='transition-all hover:scale-110'
              />
            </Link>
          </div>
        </div>
      </section>
      <FeaturedProducts />
      <section  className='sm:pt-2 pt-5 pb-10 mt-5'>
             <Image
                src={Advertisingbanner.src}
                width={Advertisingbanner.width}
                height={Advertisingbanner.height}
                alt='Advertisingbanner'
              />
      </section>
      <Testimonial />
      <section className='bg-gray-50 lg:px-32 px-4 border-t py-10'>
          <div className='grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10'>
            <div className='text-center'>
              <p className='flex justify-center items-center mb-3'>
                  <GiReturnArrow size={30} />
              </p>
              <h4 className='text-xl font-semibold'>7-days Return</h4>
              <p>Risk free shipping with easy return</p>
              <p></p>
            </div>
             <div className='text-center'>
              <p className='flex justify-center items-center mb-3'>
                  <BiSupport size={30} />
              </p>
              <h4 className='text-xl font-semibold'>24/7 Support</h4>
              <p>24/7 support, alway here just for you.</p>
              <p></p>
            </div>
             <div className='text-center'>
              <p className='flex justify-center items-center mb-3'>
                  <FaShippingFast size={30} />
              </p>
              <h4 className='text-xl font-semibold'>Free Shipping</h4>
              <p>No extra costs, just the price you see.</p>
              <p></p>
            </div>
             <div className='text-center'>
              <p className='flex justify-center items-center mb-3'>
                  <TbRosetteDiscountFilled size={30} />
              </p>
              <h4 className='text-xl font-semibold'>Member Discounts</h4>
              <p>Special offers for our loyal customers.</p>
              <p></p>
            </div>
          </div>
      </section>
    </>
  )
}

export default Home
