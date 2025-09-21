import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import ImgPlaceHolder from '../../../../../../public/assets/images/img-placeholder.webp'
import { IoStar } from 'react-icons/io5'

const LatestReview = () => {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Rating</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>

                    {
                        Array.from({ length: 10 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell className='flex items-center gap-2'>
                                    <Avatar>
                                        <AvatarImage 
                                        src={ImgPlaceHolder.src}
                                        />
                                    </Avatar>
                                    <span className='line-clamp-1'>Lorem ipsum dolor.</span>
                                </TableCell>
                                <TableCell>
                                    <div className='flex items-center'>
                                        {
                                              Array.from({ length: 5 }).map((_, i) => (
                                                <span key={i}>
                                                    <IoStar />
                                                </span>
                                              ))
                                        }
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default LatestReview
