import React from 'react'
import imgPlaceHolder from '../../../../public/assets/images/img-placeholder.webp'
import Image from 'next/image'
import Link from 'next/link'
import { PRODUCT_DETAILS } from '@/WebsiteRoute'

const ProductBox = ({ product }) => {
    return (
        <div className='rounded-lg hover:shadow-lg overflow-hidden border cursor-pointer'>
            <Link href={PRODUCT_DETAILS(product.slug)}>
            <Image
                src={product?.media[0]?.secure_url || imgPlaceHolder.src}
                alt={product?.media[0]?.alt || product?.name}
                title={product?.media[0]?.title || product?.name}
                width={400}
                height={400}
                className='w-full lg:h-[300px] md:h-[200px] h-[150px] object-cover object-top'
            />
            <div className='p-3 border-t'>
                <h4>{product?.name}</h4>
                <p className='flex gap-3 mt-2 '>
                    <span className='line-through text-gray-400'>{product?.mrp.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</span>
                    <span className='font-semibold'>{product?.sellingPrice.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</span>
                </p>
            </div>
            </Link>
        </div>
    )
}

export default ProductBox
