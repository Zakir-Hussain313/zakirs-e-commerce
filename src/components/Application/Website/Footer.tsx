import Image from 'next/image'
import React from 'react'
import logo from '../../../../public/assets/images/logo-black.png'
import Link from 'next/link'
import { WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_REGISTER } from '@/WebsiteRoute'
import { IoLocationOutline } from 'react-icons/io5'
import { MdOutlineMail, MdOutlinePhone } from 'react-icons/md'
import { AiOutlineYoutube } from 'react-icons/ai'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { FiTwitter } from 'react-icons/fi'
import { CiFacebook } from "react-icons/ci";

const Footer = () => {
  return (
    <footer className='bg-gray-50 border-t'>
      <div className='grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-10 py-10 lg:px-32 px-4'>

        <div className='lg:col-span-1 md:col-span-2 col-span-1'>
          <Image
            src={logo}
            alt='logo'
            width={383}
            height={146}
            className='w-36 mb-2'
          />
          <p className='text-gray-500 text-sm'>
            E-store is your trusted destination for quality and convenience. From fashion to essentials, we bring everything you need right to your doorstep. Shop smart, live better — only at E-store.
          </p>
        </div>
        <div>
          <h4 className='text-xl font-black mb-5 uppercase'>Categories</h4>
          <ul>
            <li className='mb-2 text-gray-500'>
              <Link href={''}>T-shirt</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={''}>Hoodies</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={''}>Oversized</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={''}>Full Sleeves</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={''}>Polo</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className='text-xl font-black mb-5 uppercase'>useful Links</h4>
          <ul>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_HOME}>Home</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={''}>About</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={''}>Shop</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_REGISTER}>Register</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_LOGIN}>Login</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className='text-xl font-black mb-5 uppercase'>Help Center</h4>
          <ul>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_REGISTER}>Register</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_LOGIN}>Login</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_HOME}>My Account</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={''}>privacy Policy</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={''}>Terms and Conditions</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className='text-xl font-black mb-5 uppercase'>contact us</h4>
          <ul>
            <li className='mb-2 text-gray-500 flex gap-2'>
              <IoLocationOutline size={25} />
              <span className='text-sm'>E-store market Quetta, Pakistan. 87300</span>
            </li>
            <li className='mb-2 text-gray-500 flex gap-2'>
              <MdOutlinePhone size={25} />
              <Link className='text-sm hover:text-primary' href={'tel:+92-3168021003'}>+92 3168021003</Link>
            </li>
            <li className='mb-2 text-gray-500 flex gap-2'>
              <MdOutlineMail size={25} />
              <Link className='text-sm hover:text-primary' href={'mailto:regalt0s375@gmail.com'}>+92 3168021003</Link>
            </li>
          </ul>
          <div className='flex gap-5 mt-5'>
            <Link href={''}><AiOutlineYoutube className='text-primary' size={25} /></Link>
            <Link href={''}><FaInstagram className='text-primary' size={25} /></Link>
            <Link href={''}><FaWhatsapp className='text-primary' size={25} /></Link>
            <Link href={''}><FiTwitter className='text-primary' size={25} /></Link>
            <Link href={''}><CiFacebook className='text-primary' size={25} /></Link>
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center py-7 bg-gray-100'>
          <p>© 2025 Estore. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
