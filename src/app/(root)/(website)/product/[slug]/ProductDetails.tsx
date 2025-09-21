'use client'
import React, { useEffect, useState } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { PRODUCT_DETAILS, WEBSITE_CART, WEBSITE_SHOP } from '@/WebsiteRoute'
import Link from 'next/link'
import Image from 'next/image'
import ImgPlaceHolder from '../../../../../../public/assets/images/img-placeholder.webp'
import { IoStar } from 'react-icons/io5'
import { decode } from 'entities'
import { HiMinus, HiPlus } from 'react-icons/hi2'
import { ButtonLoading } from '@/components/Application/ButtonLoading'
import { useDispatch, useSelector } from 'react-redux'
import { addIntoCart } from '@/store/reducer/cartReducer'
import { showToast } from '@/lib/showToast'
import { Button } from '@/components/ui/button'
import LoadingSvg from '../../../../../../public/assets/images/loading.svg'
import ProductReview from '@/components/Application/Website/ProductReview'

const ProductDetails = ({ product, varient, color, size, reviewCount }) => {

    const dispatch = useDispatch()
    const cartStore = useSelector(store => store.cartStore)

    const [activeThumb, setActiveThumb] = useState()
    const [qty, setQty] = useState(1)
    const [isAddedIntoCart, setIsAddedIntoCart] = useState(false)
    const [isProductLoading, setIsProductLoading] = useState(false)

    useEffect(() => {
        setActiveThumb(varient.media[0]?.secure_url)
    }, [varient])

    useEffect(() => {
        if (cartStore.count > 0) {
            const existingProduct = cartStore.products.findIndex(
                (cartProduct) => cartProduct.productId === product._id && cartProduct.varientId === varient._id
            )

            if (existingProduct >= 0) {
                setIsAddedIntoCart(true)
            }
            else {
                setIsAddedIntoCart(false)
            }
        }
        setIsProductLoading(false)

    }, [varient])

    const handleThumb = (thumbUrl) => {
        setActiveThumb(thumbUrl)
    }

    const handleQty = (actionType) => {
        if (actionType === 'inc') {
            setQty(prev => prev + 1)
        }
        else {
            if (qty !== 1) {
                setQty(prev => prev - 1)
            }
        }
    }

    const handleAddToCart = () => {
        const cartProduct = {
            productId: product._id,
            varientId: varient._id,
            name: product.name,
            url: product.slug,
            mrp: varient.mrp,
            sellingPrice: varient.sellingPrice,
            color: varient.color,
            size: varient.size,
            media: varient?.media[0]?.secure_url,
            qty: qty
        }

        dispatch(addIntoCart(cartProduct));
        setIsAddedIntoCart(true);
        showToast('success', 'Product added into cart')
    }

    return (
        <div className='lg:px-32 px-4'>
            {
                isProductLoading
                &&
                <div className='fixed top-25 left-1/2 -translate-x-1/2 z-50'>
                    <Image src={LoadingSvg} alt='Loading' width={80} height={80} />
                </div>
            }
            <div className='my-10'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={WEBSITE_SHOP}>Products</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href={PRODUCT_DETAILS(product.slug)}>{product?.name}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="md:flex justify-between items-start lg:gap-10 gap-5 mb-20 ">
                <div className="md:w-1/2 xl:flex xl:justify-center xl:gap-5 md:sticky md:top-0">
                    <div className='xl:order-last xl:mb-0 mb-5 xl:w-[calc(100%-144px)]'>
                        <Image
                            src={activeThumb || ImgPlaceHolder}
                            alt='Product Image'
                            width={650}
                            height={650}
                            className='border rounded max-w-full'
                        />
                    </div>
                    <div className='flex gap-10 xl:flex-col items-center overflow-auto xl:pb-0 pb-2 max-h-[600px] xl:w-36 xl:gap-5 gap-3'>
                        {varient?.media?.map((thumb) => (
                            <Image
                                key={thumb._id}
                                src={thumb?.secure_url || ImgPlaceHolder}
                                alt='Product Thumbnail'
                                width={100}
                                height={100}
                                className={`md:max-w-full max-w-16 rounded cursor-pointer ${thumb.secure_url === activeThumb ? 'border-2 border-primary' : 'border'}`}
                                onClick={() => handleThumb(thumb.secure_url)}
                            />
                        ))}
                    </div>
                </div>
                <div className='md:w-1/2 md:mt-0 mt-5'>
                    <h1 className='text-3xl font-semibold mb-2'>{product.name}</h1>
                    <div className='flex items-center gap-1 mb-5'>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <IoStar key={i} />
                        ))}
                        <span className='text-sm ps-2'>({reviewCount} Reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className='text-xl font-semibold'>
                            {varient.sellingPrice.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                        </span>
                        <span className='text-sm line-through text-gray-500'>
                            {varient.mrp.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                        </span>
                        <span className='text-white bg-red-500 rounded-2xl px-3 py-1 text-xs ms-5'>
                            -{varient.discountPercentage}%
                        </span>
                    </div>
                    <div className='line-clamp-3' dangerouslySetInnerHTML={{ __html: decode(product.description) }}>
                    </div>
                    <div className='mt-5'>
                        <p className='mb-2'>
                            <span className='font-semibold'>
                                Color : {varient.color}
                            </span>
                        </p>
                        <div className='flex gap-5'>
                            {color.map(color => (
                                <Link onClick={() => setIsProductLoading(true)} href={`${PRODUCT_DETAILS(product.slug)}?color=${color}&size=${varient.size}`} key={color} className={`border py-1 px-3 cursor-pointer rounded-lg hover:bg-primary hover:text-white ${color === varient.color ? 'bg-primary text-white' : ''}`}>
                                    {color}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className='mt-5'>
                        <p className='mb-2'>
                            <span className='font-semibold'>
                                Size : {varient.size}
                            </span>
                        </p>
                        <div className='flex gap-5'>
                            {size.map(size => (
                                <Link onClick={() => setIsProductLoading(true)} href={`${PRODUCT_DETAILS(product.slug)}?color=${varient.color}&size=${size}`} key={size} className={`border py-1 px-3 cursor-pointer rounded-lg hover:bg-primary hover:text-white ${size === varient.size ? 'bg-primary text-white' : ''}`}>
                                    {size}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className='mt-5'>
                        <p className='font-semibold mb-2'>Quantity</p>
                        <div className="flex items-center h-10 border rounded-full w-fit">
                            <button type='button' className='h-full w-10 flex justify-center items-center cursor-pointer' onClick={() => handleQty('desc')}>
                                <HiMinus />
                            </button>
                            <input type="text" value={qty} className='w-14 text-center border-none outline-offset-0' readOnly />
                            <button type='button' className='h-full w-10 flex justify-center items-center cursor-pointer' onClick={() => handleQty('inc')}>
                                <HiPlus />
                            </button>
                        </div>
                    </div>
                    <div className='mt-5'>
                        {
                            !isAddedIntoCart
                                ?
                                <ButtonLoading
                                    type='button'
                                    text='Add to Cart'
                                    className='w-full py-6 text-md rounded-full cursor-pointer'
                                    onClick={handleAddToCart}
                                />
                                :
                                <Button className='w-full py-6 text-md rounded-full cursor-pointer' type='button' asChild>
                                    <Link href={WEBSITE_CART}>Go to cart</Link>
                                </Button>
                        }
                    </div>
                </div>
            </div>
            <div className='mb-10'>
                <div className="shadow rounded border-b">
                    <div className="bg-gray-50 p-3">
                        <h2 className='font-semibold text-2xl'>Product Description</h2>
                    </div>
                    <div className='p-3'>
                        <div dangerouslySetInnerHTML={{ __html: decode(product.description) }}>
                        </div>
                    </div>
                </div>
            </div>
            <ProductReview productId={product._id} />
        </div>
    )
}

export default ProductDetails
