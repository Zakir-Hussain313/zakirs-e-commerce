import Image from 'next/image'
import React from 'react'
import userIcon from '../../../../public/assets/images/user.png'
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime"
import { IoStar } from 'react-icons/io5'

dayjs.extend(relativeTime)

const ReviewList = ({ review }) => {
    return (
        <div className='flex gap-5'>
            <div className="w-[60px]">
                <Image
                    src={review?.avatar?.url || userIcon.src}
                    alt='User'
                    width={55}
                    height={55}
                    className='rounded-lg'
                />
            </div>
            <div className="w-[calc(100%-100px)]">
                <div>
                    <h4 className='text-xl font-semibold'>{review?.title}</h4>
                    <p className='flex gap-2 items-center'>
                        <span className='font-medium'>{review?.reviewedBy}</span>
                        -
                        <span className="text-gray-500">  {review?.createdAt ? dayjs(review.createdAt).fromNow() : "just now"}</span>
                        <span className='flex items-center text-xs'>
                            ({review?.rating} <IoStar className='text-yellow-500 mb-[2px]' />)
                        </span>
                    </p>
                    <p className='mt-2 text-gray-600'>{review?.review}</p>
                </div>
                <hr className='mt-5' />
            </div>
        </div>
    )
}

export default ReviewList
