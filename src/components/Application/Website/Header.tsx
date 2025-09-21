'use client'
import { USER_DASHBOARD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_SHOP } from '@/WebsiteRoute'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import logo from '../../../../public/assets/images/logo-black.png'
import { IoIosSearch } from 'react-icons/io'
import Cart from './Cart'
import { MdOutlineAccountCircle } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import userIcon from '../../../../public/assets/images/user.png'
import { HiMiniBars3 } from 'react-icons/hi2'
import { IoMdClose } from 'react-icons/io'
import Search from './Search'

const Header = () => {


    const auth = useSelector((state: RootState) => state.auth.auth);
    const [ isMoibileMenu , setIsMobileMenu ] = useState(false)
    const [ showSearch , setShowSearch ] = useState(false)

    return (
        <div className='bg-white px-4 lg:px-20 border-b'>
            <div className='flex justify-between items-center lg:py-5 py-3'>
                <Link href={WEBSITE_HOME}>
                    <Image
                        src={logo}
                        alt='logo'
                        width={383}
                        height={146}
                        className='lg:w-32 w-24'
                    />
                </Link>
                <div className='flex justify-between gap-20'>
                    <nav className={`lg:relative lg:h-auto lg:px-0 lg:w-auto lg:top-0 lg:left-0 lg:p-0 bg-white fixed z-50 top-0 w-full h-screen transition-all ${ isMoibileMenu ? 'left-0' : '-left-full'}`}>
                        <div className='lg:hidden flex justify-between items-center border-b bg-gray-50 p-3'>
                            <Link href={WEBSITE_HOME}>
                                <Image
                                    src={logo}
                                    alt='logo'
                                    width={383}
                                    height={146}
                                    className='lg:w-32 w-28'
                                />
                            </Link>
                            <button type='button' onClick={() => setIsMobileMenu(false)}>
                                <IoMdClose
                                    size={25}
                                    className='hover:text-primary cursor-pointer'
                                />
                            </button>
                        </div>
                        <ul className='lg:flex justify-between items-center gap-10'>
                            <li className='text-gray-600 hover:text-primary hover:font-semibold pl-8'>
                                <Link href={WEBSITE_HOME} className='block py-2'>
                                    Home
                                </Link>
                            </li>
                            <li className='text-gray-600 hover:text-primary hover:font-semibold pl-8'>
                                <Link href={WEBSITE_HOME} className='block py-2'>
                                    About
                                </Link>
                            </li>
                            <li className='text-gray-600 hover:text-primary hover:font-semibold pl-8'>
                                <Link href={WEBSITE_SHOP} className='block py-2'>
                                    Shop
                                </Link>
                            </li>
                            <li className='text-gray-600 hover:text-primary hover:font-semibold pl-8'>
                                <Link href={WEBSITE_HOME} className='block py-2'>
                                    T-Shirt
                                </Link>
                            </li>
                            <li className='text-gray-600 hover:text-primary hover:font-semibold pl-8'>
                                <Link href={WEBSITE_HOME} className='block py-2'>
                                    Hoodies
                                </Link>
                            </li>
                            <li className='text-gray-600 hover:text-primary hover:font-semibold pl-8'>
                                <Link href={WEBSITE_HOME} className='block py-2'>
                                    Oversize
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className='flex justify-between items-center gap-8'>
                        <button type='button' onClick={() => setShowSearch(!showSearch)}>
                            <IoIosSearch
                                className='text-gray-500 hover:text-primary cursor-pointer'
                                size={25}
                            />
                        </button>
                        <Cart />
                        {
                            !auth
                                ?
                                <Link href={WEBSITE_LOGIN}>
                                    <MdOutlineAccountCircle
                                        className='text-gray-500 hover:text-primary cursor-pointer'
                                        size={25}
                                    />
                                </Link>
                                :
                                <Link href={USER_DASHBOARD}>
                                    <Avatar>
                                        <AvatarImage src={auth?.avatar?.url || userIcon.src} />
                                    </Avatar>
                                </Link>
                        }

                        <button type='button' className='lg:hidden block' onClick={() => setIsMobileMenu(true)}>
                            <HiMiniBars3
                                size={25}
                                className='hover:text-primary cursor-pointer'
                            />
                        </button>
                    </div>
                </div>
            </div>
            <Search isShow={showSearch} />
        </div>
    )
}

export default Header
