'use client'
import WebsiteBreadCrumb from '@/components/Application/Website/WebsiteBreadCrumb'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PRODUCT_DETAILS, WEBSITE_CART, WEBSITE_CHECKOUT, WEBSITE_SHOP } from '@/WebsiteRoute'
import Image from 'next/image'
import ImagePlaceholder from '../../../../../public/assets/images/img-placeholder.webp'
import { HiMinus, HiPlus } from 'react-icons/hi2'
import { IoIosCloseCircleOutline } from "react-icons/io";
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/store/reducer/cartReducer'

const breadcrumb = {
  title: 'Cart',
  link: [
    { label: 'Cart', href: WEBSITE_CART }
  ]
}

const CartPage = () => {
  const dispatch = useDispatch()
  const cart = useSelector(store => store.cartStore);

  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const cartProducts = cart.products;
    const totalAmount = cartProducts.reduce((sum, product) => sum + (product.sellingPrice * product.qty), 0);
    const discount = cartProducts.reduce((sum, product) => sum + (product.mrp - product.sellingPrice) * product.qty, 0);

    setSubTotal(totalAmount);
    setDiscount(discount);
  }, [cart])

  return (
    <div>
      <WebsiteBreadCrumb props={breadcrumb} />
      {cart.count === 0 ? (
        <div className="flex justify-center items-center w-screen h-[400px]">
          <div className="text-center">
            <h4 className='text-4xl font-semibold mb-10'>Your cart is Empty!</h4>
            <Button type='button' asChild>
              <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className='flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 px-4'>
          <div className="lg:w-[70%] w-full ">
            <table className='w-full border border-collapse'>
              <thead className='border-b bg-gray-50 md:table-header-group hidden'>
                <tr>
                  <th className='text-start p-3'>Product</th>
                  <th className='text-start p-3'>Price</th>
                  <th className='text-start p-3'>Quantity</th>
                  <th className='text-start p-3'>Total</th>
                  <th className='text-start p-3'>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.products.map(product => (
                  <tr key={product.varientId} className='md:table-row block border-b'>

                    {/* Product */}
                    <td className="p-3 md:table-cell block">
                      <div className="flex items-center gap-5">
                        <Image
                          src={product.media || ImagePlaceholder.src}
                          alt={product.name}
                          width={60}
                          height={60}
                        />
                        <div>
                          <h4 className='text-lg line-clamp-1 font-medium'>
                            <Link href={PRODUCT_DETAILS(product.url)}>{product.name}</Link>
                          </h4>
                          <p className='text-sm'>Size : {product.size}</p>
                          <p className='text-sm'>Color : {product.color}</p>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="md:table-cell md:p-3 px-3 pb-2 flex justify-between text-center">
                      <span className="md:hidden font-medium">Price : </span>
                      <span>
                        {product.sellingPrice.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="md:table-cell md:p-3 px-3 pb-2 flex justify-between">
                      <span className="md:hidden font-medium">Quantity : </span>
                      <div className="flex justify-center items-center md:h-10 h-7 border rounded-full w-[100px] px-2">
                        <button type='button' className='h-full w-10 flex justify-center items-center cursor-pointer' onClick={() => dispatch(decreaseQuantity({ productId: product.productId, varientId: product.varientId }))}>
                          <HiMinus />
                        </button>
                        <input type="text" value={product.qty} className='md:w-14 w-6 text-center border-none outline-none bg-transparent' readOnly />
                        <button type='button' className='h-full w-10 flex justify-center items-center cursor-pointer' onClick={() =>  dispatch(increaseQuantity({ productId: product.productId, varientId: product.varientId }))}>
                          <HiPlus />
                        </button>
                      </div>
                    </td>

                    {/* Total */}
                    <td className="md:table-cell md:p-3 px-3 pb-2 flex justify-between text-center">
                      <span className="md:hidden font-medium">Total : </span>
                      <span>
                        {(product.sellingPrice * product.qty).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="md:table-cell md:p-3 px-3 pb-2 flex justify-between text-center">
                      <span className="md:hidden font-medium">Remove : </span>
                      <button
                        className='text-red-500 cursor-pointer font-semibold'
                        type='button'
                        onClick={() => dispatch(removeFromCart({ productId: product.productId, varientId: product.varientId }))}
                      >
                        <IoIosCloseCircleOutline size={25} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="lg:w-[30%] w-full ">
            <div className="rounded bg-gray-50 p-5 sticky top-5 ">
              <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
              <div className="">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="font-medium py-2">SubTotal</td>
                      <td className="text-end py-2">
                        {subTotal.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2">Discount</td>
                      <td className="text-end py-2">
                        -{discount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2">Total</td>
                      <td className="text-end py-2">
                        {subTotal.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Button type='button' asChild className='w-full rounded-full mt-5 mb-3 bg-black'>
                  <Link href={WEBSITE_CHECKOUT}>
                    Proceed to Checkout
                  </Link>
                </Button>
                <p className="text-center">
                  <Link href={WEBSITE_SHOP} className='hover:underline'>
                    Continue Shopping
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage
