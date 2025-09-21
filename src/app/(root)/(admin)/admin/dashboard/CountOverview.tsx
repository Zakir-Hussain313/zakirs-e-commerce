'use client'
import Link from 'next/link'
import React from 'react'
import { BiCategory } from 'react-icons/bi'
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";
import useFetch from '@/hooks/useFetch';
import { ADMIN_CATEGORY_SHOW, ADMIN_CUSTOMERS_SHOW, ADMIN_ORDERS_SHOW, ADMIN_PRODUCT_SHOW } from '@/AdminPanelRoutes';

const CountOverview = () => {

    const { data : countData } = useFetch('/api/dashboard/admin/count');

    return (
        <div className='grid lg:grid-cols-4 sm:grid-cols-2 sm:gap-10 gap-5'>
            <Link href={ADMIN_CATEGORY_SHOW}>
                <div className='flex items-center justify-between p-3 bg-white dark:bg-card dark:border-gray-800 dark:border-l-green-400 rounded-lg border border-l-4 border-l-green-400'>
                    <div>
                        <h4 className='font-medium text-gray-500 dark:text-white'>Total Categories</h4>
                        <span className='text-xl font-bold'>{countData?.data?.category || 0}</span>
                    </div>
                    <div>
                        <span className='flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full'>
                            <BiCategory />
                        </span>
                    </div>
                </div>
            </Link>
            <Link href={ADMIN_PRODUCT_SHOW}>
                <div className='flex items-center justify-between p-3 bg-white dark:bg-card dark:border-gray-800 dark:border-l-blue-400 rounded-lg border border-l-4 border-l-blue-600'>
                    <div>
                        <h4 className='font-medium text-gray-500 dark:text-white'>Total Products</h4>
                        <span className='text-xl font-bold'>{countData?.data?.product || 0}</span>
                    </div>
                    <div>
                        <span className='flex items-center justify-center w-10 h-10 bg-blue-700 text-white rounded-full'>
                            <IoShirtOutline />
                        </span>
                    </div>
                </div>
            </Link>
            <Link href={ADMIN_CUSTOMERS_SHOW}>
                <div className='flex items-center justify-between p-3 bg-white dark:bg-card dark:border-gray-800 dark:border-l-yellow-400 rounded-lg border border-l-4 border-l-yellow-400'>
                    <div>
                        <h4 className='font-medium text-gray-500 dark:text-white'>Total Customers</h4>
                        <span className='text-xl font-bold'>{countData?.data?.customer || 0}</span>
                    </div>
                    <div>
                        <span className='flex items-center justify-center w-10 h-10 bg-yellow-500 text-white rounded-full'>
                            <LuUserRound />
                        </span>
                    </div>
                </div>
            </Link>
            <Link href={ADMIN_ORDERS_SHOW}>
                <div className='flex items-center justify-between p-3 bg-white dark:bg-card dark:border-gray-800 dark:border-l-cyan-500 rounded-lg border border-l-4 border-l-cyan-500'>
                    <div>
                        <h4 className='font-medium text-gray-500 dark:text-white'>Total Orders</h4>
                        <span className='text-xl font-bold'>10</span>
                    </div>
                    <div>
                        <span className='flex items-center justify-center w-10 h-10 bg-cyan-600 text-white rounded-full'>
                            <MdOutlineShoppingBag />
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default CountOverview
