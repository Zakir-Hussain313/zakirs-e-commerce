import axios from 'axios'
import Link from 'next/link'
import React from 'react'
import { IoIosArrowRoundForward } from 'react-icons/io'
import ProductBox from './ProductBox'
import { WEBSITE_SHOP } from '@/WebsiteRoute'

const FeaturedProducts = async () => {

    const { data : productData } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/get-featured-products`);
    
    if(!productData) return null;

  return (
    <section className='lg:px-32 px-4 sm:py-10 '>
        <div className='flex justify-between items-center mb-5'>
            <h2 className='text-2xl sm:text-4xl font-semibold'>Featured Products</h2>
            <Link href={WEBSITE_SHOP} className='flex gap-2 underline underline-offset-4 hover:text-primary items-center'>View All <IoIosArrowRoundForward size={25}/></Link>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 sm:gap-10 gap-2'>
            {
                !productData.success
                &&
                <div className='text-center py-5'>Data Not found</div>
            }

            {
                productData.success
                &&
                productData.data.map((product) => (
                   <ProductBox key={product._id} product={product}/>
                ))
            }
        </div>
    </section>
  )
}

export default FeaturedProducts
