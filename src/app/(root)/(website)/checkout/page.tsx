'use client'
import { ButtonLoading } from '@/components/Application/ButtonLoading'
import WebsiteBreadCrumb from '@/components/Application/Website/WebsiteBreadCrumb'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { addIntoCart, clearCart } from '@/store/reducer/cartReducer'
import { PRODUCT_DETAILS, WEBSITE_CHECKOUT, WEBSITE_SHOP } from '@/WebsiteRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { IoCloseCircleSharp } from "react-icons/io5";
import z from 'zod'
import { FaShippingFast } from "react-icons/fa";
import { Textarea } from '@/components/ui/textarea'

const breadcrumb = {
    title: 'Checkout',
    link: [
        { label: 'Checkout', href: WEBSITE_CHECKOUT }
    ]
}

const CheckoutPage = () => {

    const dispatch = useDispatch();

    const cart = useSelector(store => store.cartStore);
    const auth = useSelector(store => store.auth.auth);

    const [verifiedCartData, setVerifiedCartData] = useState([])
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [couponCode, setCouponCode] = useState('');
    const [placingOrder, setPlacingOrder] = useState(false);

    const { data: getverifiedCartData } = useFetch('/api/cart-verification', 'POST', { data: cart.products });


    useEffect(() => {
        if (getverifiedCartData && getverifiedCartData.success) {
            const cartData = getverifiedCartData.data;
            setVerifiedCartData(cartData);
            dispatch(clearCart());

            cartData.forEach(cartItem => {
                dispatch(addIntoCart(cartItem));
            });
        }
    }, [getverifiedCartData]);

    useEffect(() => {
        const cartProducts = cart.products;
        const subTotalAmount = cartProducts.reduce((sum, product) => sum + (product.sellingPrice * product.qty), 0);
        const discount = cartProducts.reduce((sum, product) => sum + (product.mrp - product.sellingPrice) * product.qty, 0);

        setSubTotal(subTotalAmount);
        setDiscount(discount);
        setTotalAmount(subTotalAmount);
    }, [cart]);

    const couponFormSchema = zSchema.pick({
        code: true,
    });

    const couponForm = useForm({
        resolver: zodResolver(couponFormSchema),
        defaultValues: {
            code: '',
        }

    });

    const applyCoupon = async (values) => {
        setCouponLoading(true);
        try {
            // send coupon code + subtotal for validation
            const { data: response } = await axios.post('/api/coupon/apply', {
                code: values.code,
                cartTotal: subTotal,   // backend checks this against coupon.minShoppingAmount
            });

            if (!response.success) {
                throw new Error(response.message);
            }

            const discountPercentage = response.data.discountPercentage;

            // calculate discount amount
            const discountAmount = (subTotal * discountPercentage) / 100;
            setCouponDiscountAmount(discountAmount);
            setTotalAmount(subTotal - discountAmount);

            showToast('success', response.message);
            setIsCouponApplied(true);
            setCouponCode(values.code);
            couponForm.reset();
        } catch (error) {
            showToast('error', error.message);
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setIsCouponApplied(false);
        setCouponCode('');
        setTotalAmount(subTotal);
        setCouponDiscountAmount(0);
        showToast('success', 'Coupon removed successfully')
    }

    //order form
    const orderFormSchema = zSchema.pick({
        name: true,
        email: true,
        phone: true,
        country: true,
        city: true,
        state: true,
        landmark: true,
        ordernote: true,
        pincode: true,

    }).extend({
        userId: z.string().optional()
    });

    const orderForm = useForm({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            country: '',
            city: '',
            state: '',
            landmark: '',
            ordernote: '',
            pincode: '',
            userId: auth?._id
        }
    });

    const placeOrder = async (formData) => {
        console.log(formData);
        setPlacingOrder(true);
        try {

        } catch (error) {
            showToast('error', error.message);
        }
        finally {
            setPlacingOrder(false);
        }
    }

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
            )
                :
                (
                    <div className='flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 px-4'>
                        <div className="lg:w-[60%] w-full">
                            <div className="flex gap-2 font-semibold items-center">
                                <FaShippingFast size={30} />
                                Shipping Address :
                            </div>
                            <div className="mt-5">
                                <Form {...orderForm}>
                                    <form onSubmit={orderForm.handleSubmit(placeOrder)} className="grid grid-cols-2 gap-5">
                                        <div className="mb-3">
                                            <FormField control={orderForm.control}
                                                name='name'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input type='text' placeholder='Full Name*' {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}>

                                            </FormField>
                                        </div>
                                        <div className="mb-3">
                                            <FormField control={orderForm.control}
                                                name='email'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input type='email' placeholder='Email*' {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}>

                                            </FormField>
                                        </div>
                                        <div className="mb-3">
                                            <FormField control={orderForm.control}
                                                name='phone'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input type='number' placeholder='Phone*' {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}>

                                            </FormField>
                                        </div>
                                        <div className="mb-3">
                                            <FormField control={orderForm.control}
                                                name='country'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input type='text' placeholder='Country*' {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}>

                                            </FormField>
                                        </div>
                                        <div className="mb-3">
                                            <FormField control={orderForm.control}
                                                name='city'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input type='text' placeholder='City*' {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}>

                                            </FormField>
                                        </div>
                                        <div className="mb-3">
                                            <FormField control={orderForm.control}
                                                name='state'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input type='text' placeholder='State*' {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}>

                                            </FormField>
                                        </div>
                                        <div className="mb-3">
                                            <FormField control={orderForm.control}
                                                name='pincode'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input type='text' placeholder='Pincode*' {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}>

                                            </FormField>
                                        </div>
                                        <div className="mb-3">
                                            <FormField control={orderForm.control}
                                                name='landmark'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input placeholder='Landmark' {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}>

                                            </FormField>
                                        </div>
                                        <div className="mb-3 col-span-2">
                                            <FormField control={orderForm.control}
                                                name='ordernote'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Textarea placeholder='Enter the order note' {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}>

                                            </FormField>
                                        </div>
                                        <div>
                                            <ButtonLoading type='submit' text='Place Order' loading={placingOrder} className='bg-black cursor-pointer rounded-full px-5' />
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        </div>
                        <div className="lg:w-[40%] w-full ">
                            <div className="rounded bg-gray-50 p-5 sticky top-5 ">
                                <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
                                <div className="">
                                    <table className="w-full border">
                                        <tbody>
                                            {
                                                verifiedCartData && verifiedCartData.map(product => (
                                                    <tr key={product.varientId}>
                                                        <td className='p-3'>
                                                            <div className="flex items-center gap-5">
                                                                <Image
                                                                    src={product.media}
                                                                    width={60}
                                                                    height={60}
                                                                    alt={product.name}
                                                                    className='rounded'
                                                                />
                                                                <div className="">
                                                                    <h4 className="font-medium line-clamp-1">
                                                                        <Link href={PRODUCT_DETAILS(product.url)}>{product.name}</Link>
                                                                    </h4>
                                                                    <p className='text-sm'>Color : {product.color}</p>
                                                                    <p className='text-sm'>Size : {product.size}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            <p className='text-sm text-nowrap'>{product.qty} X {product.sellingPrice.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</p>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
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
                                                <td className="font-medium py-2">Coupon Discount</td>
                                                <td className="text-end py-2">
                                                    -{couponDiscountAmount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="font-medium py-2 text-xl">Total</td>
                                                <td className="text-end py-2">
                                                    {totalAmount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="mt-2 mb-5">
                                        {
                                            !isCouponApplied
                                                ?
                                                <Form {...couponForm}>
                                                    <form onSubmit={couponForm.handleSubmit(applyCoupon)} className="flex justify-between gap-5">
                                                        <div className="w-[calc(100%-100px)]">
                                                            <FormField control={couponForm.control}
                                                                name='code'
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input placeholder='Enter the coupon code' {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}>

                                                            </FormField>
                                                            <FormField
                                                                control={couponForm.control}
                                                                name="minShoppingAmount"
                                                                render={({ field }) => (
                                                                    <input type="hidden" {...field} />
                                                                )}
                                                            />

                                                        </div>
                                                        <div className='w-[100px]'>
                                                            <ButtonLoading type='submit' text='Apply' className='w-full cursor-pointer' loading={couponLoading} />
                                                        </div>
                                                    </form>
                                                </Form>
                                                :
                                                <div className='flex justify-between py-1 px-5 rounded-lg bg-gray-200'>
                                                    <div className="">
                                                        <span className='text-xs'>
                                                            Coupon :
                                                        </span>
                                                        <p className="font-semibold text-sm">
                                                            {couponCode}
                                                        </p>
                                                    </div>
                                                    <button className='text-red-500 cursor-pointer' type='button' onClick={removeCoupon}>
                                                        <IoCloseCircleSharp size={25} />
                                                    </button>
                                                </div>
                                        }
                                    </div>
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

export default CheckoutPage
