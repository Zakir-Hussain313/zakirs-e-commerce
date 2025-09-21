'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import React, { useEffect, useState } from 'react'
import { IoStar } from 'react-icons/io5'
import { ButtonLoading } from '../ButtonLoading'
import { zSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSelector } from 'react-redux'
import { Rating } from '@mui/material'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import Link from 'next/link'
import { WEBSITE_LOGIN } from '@/WebsiteRoute'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import ReviewList from './ReviewList'
import useFetch from '@/hooks/useFetch'

const formSchema = zSchema.pick({
    product: true,
    userId: true,
    rating: true,
    title: true,
    review: true
})

const ProductReview = ({ productId }) => {

    const auth = useSelector((state) => state.auth.auth);
    const queryClient = useQueryClient()

    const [loading, setLoading] = useState(false)
    const [currentUrl, setCurrentUrl] = useState('');
    const [isReview, setIsReview] = useState(false);
    const [reviewCount, setReviewCount] = useState()

    const { data: reviewDetails } = useFetch(`/api/review/details?productId=${productId}`);

    useEffect(() => {
        if (reviewDetails && reviewDetails.success) {
            const reviewCountData = reviewDetails.data;
            setReviewCount(reviewCountData);
        }
    }, [reviewDetails])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }
    }, [])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            product: productId || '',
            userId: auth?._id || '',
            rating: 0,
            title: '',
            review: ''
        },
    });

    useEffect(() => {
        form.setValue('userId', auth?._id)
    }, [auth])

    const handleReviewSubmit = async (values) => {
        setLoading(true);
        try {
            const { data: response } = await axios.post('/api/review/create', values);
            if (!response.success) {
                throw new Error(response.message);
            }
            form.reset();
            showToast('success', response.message)
            queryClient.invalidateQueries(['product-review'])
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchReview = async ({ pageParam }) => {
        const { data: getReviewData } = await axios.get(`/api/review/get?productId=${productId}&page=${pageParam}`);
        if (!getReviewData.success) {
            return;
        }
        return getReviewData.data;
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
    } = useInfiniteQuery({
        queryKey: ["reviews", productId],
        queryFn: async ({ pageParam = 0 }) => {
            const res = await fetch(`/api/review/get?productId=${productId}&page=${pageParam}`);
            const json = await res.json();
            return json.data;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            return lastPage?.nextPage ?? null;
        },
    });





    return (
        <div className="shadow rounded border-b mb-20">
            <div className="bg-gray-50 p-3">
                <h2 className='font-semibold text-2xl'>Rating and Reviews</h2>
            </div>
            <div className='p-3'>
                <div className='flex justify-between flex-wrap items-center'>
                    <div className="md:w-1/2 w-full md:flex md:gap-10 md:mb-0 mb-5">
                        <div className='md:w-[200px] w-full md:mb-0 mb-5'>
                            <h4 className='text-center text-8xl font-semibold'>
                                {reviewCount?.averageRating}
                            </h4>
                            <div className='flex justify-center gap-2'>
                                <IoStar />
                                <IoStar />
                                <IoStar />
                                <IoStar />
                                <IoStar />
                            </div>
                            <p className='text-center mt-3'>
                                ({reviewCount?.totalReview} rating and reviews)
                            </p>
                        </div>
                        <div className="md:w-[calc(100%-200px)] flex items-center">
                            <div className='w-full'>
                                {[5, 4, 3, 2, 1,].map(rating => (
                                    <div key={rating} className='flex items-center gap-2 mb-2'>
                                        <div className='flex items-center gap-1'>
                                            <p className='w-3 '>{rating}</p>
                                            <IoStar />
                                        </div>
                                        <Progress value={reviewCount?.percentage[rating]} />
                                        <span className='text-sm'>
                                            {reviewCount?.rating[rating]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2 w-full md:text-end text-center">
                        <Button type='button' variant={'outline'} className='md:w-fit w-full py-6 px-10 cursor-pointer' onClick={() => setIsReview(!isReview)} >
                            Write Review
                        </Button>
                    </div>
                </div>
                {
                    isReview
                    &&
                    <div className='my-5'>
                        <hr className="mb-5" />
                        <h4 className='text-xl font-semibold mb-3'>Write Your Review</h4>
                        {
                            !auth
                                ?
                                <>
                                    <p className='mb-2'>Login to submit your review</p>
                                    <Button asChild type='button'>
                                        <Link href={`${WEBSITE_LOGIN}?callback=${currentUrl}`}>Login</Link>
                                    </Button>
                                </>
                                :
                                <>
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(handleReviewSubmit)}
                                            className="space-y-8"
                                        >
                                            <div className="mt-5">
                                                <FormField
                                                    control={form.control}
                                                    name="rating"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Rating
                                                                    name='Rating'
                                                                    value={field.value}
                                                                    size='large'
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <FormField
                                                    control={form.control}
                                                    name="title"
                                                    render={({ field }) => (
                                                        <FormItem className="relative">
                                                            <FormLabel>Title</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    placeholder="Enter the review title"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <button
                                                                type="button"
                                                                className="absolute top-[2rem] right-[1rem] cursor-pointer"
                                                            >
                                                            </button>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <FormField
                                                    control={form.control}
                                                    name="review"
                                                    render={({ field }) => (
                                                        <FormItem className="relative">
                                                            <FormLabel>Review</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder='Write your review'
                                                                    {...field}
                                                                />
                                                            </FormControl>

                                                            <button
                                                                type="button"
                                                                className="absolute top-[2rem] right-[1rem] cursor-pointer"
                                                            >
                                                            </button>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div>
                                                <ButtonLoading
                                                    loading={loading}
                                                    type="submit"
                                                    text="Submit Review"
                                                    className="cursor-pointer mt-3"
                                                />
                                            </div>
                                        </form>
                                    </Form>
                                </>
                        }
                    </div>
                }

                <div className="mt-10 pt-5 border-t">
                    <h5 className='text-xl font-semibold'>{data?.pages[0]?.totalReview} Reviews</h5>
                    <div className='mt-10'>
                        {data && data?.pages?.map((page) => (
                            page.reviews.map((review) => (
                                <div className='mb-3' key={review._id}>
                                    <ReviewList review={review} />
                                </div>
                            ))
                        ))}
                        {
                            hasNextPage
                            &&
                            <div className='flex justify-center py-5'>
                                <ButtonLoading
                                    type='button'
                                    loading={isFetching}
                                    text='Load More'
                                    onClick={fetchNextPage}
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductReview



