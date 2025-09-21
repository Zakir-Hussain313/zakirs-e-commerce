import Link from 'next/link'
import React from 'react'
import { BiCategory } from 'react-icons/bi'
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlinePermMedia } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { ADMIN_CATEGORY_ADD, ADMIN_COUPON_ADD, ADMIN_MEDIA_SHOW, ADMIN_PRODUCT_ADD } from '@/AdminPanelRoutes';

const QuickAdd = () => {
    return (
        <div className='grid lg:grid-cols-4 sm:grid-cols-2 sm:gap-10 gap-5 mt-10'>
            <Link href={ADMIN_CATEGORY_ADD}>
                <div className='flex justify-between items-center rounded-lg p-3 shadow bg-white dark:bg-card bg-gradient-to-tr from-green-600 via-green-500 to-green-400'>
                    <h4 className='text-white font-medium '>Add Category</h4>
                    <span className='w-10 h-10 flex justify-center items-center rounded-full border border-green-100 text-white'>
                        <BiCategory size={20} />
                    </span>
                </div>
            </Link>
            <Link href={ADMIN_PRODUCT_ADD}>
                <div className='flex justify-between items-center rounded-lg p-3 shadow bg-white dark:bg-card bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-400'>
                    <h4 className='text-white font-medium '>Add Product</h4>
                    <span className='w-10 h-10 flex justify-center items-center rounded-full border border-blue-100 text-white'>
                        <IoShirtOutline size={20} />
                    </span>
                </div>
            </Link>
            <Link href={ADMIN_COUPON_ADD}>
                <div className='flex justify-between items-center rounded-lg p-3 shadow bg-white dark:bg-card bg-gradient-to-tr from-yellow-600 via-yellow-500 to-yellow-400'>
                    <h4 className='text-white font-medium '>Add Coupon</h4>
                    <span className='w-10 h-10 flex justify-center items-center rounded-full border border-yellow-100 text-white'>
                        <RiCoupon2Line size={20} />
                    </span>
                </div>
            </Link>
            <Link href={ADMIN_MEDIA_SHOW}>
                <div className='flex justify-between items-center rounded-lg p-3 shadow bg-white dark:bg-card bg-gradient-to-tr from-cyan-600 via-cyan-500 to-cyan-400'>
                    <h4 className='text-white font-medium '>Add Media</h4>
                    <span className='w-10 h-10 flex justify-center items-center rounded-full border border-cyan-100 text-white'>
                        <MdOutlinePermMedia size={20} />
                    </span>
                </div>
            </Link>
        </div>
    )
}

export default QuickAdd
