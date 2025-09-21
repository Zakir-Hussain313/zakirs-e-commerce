import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { sortings } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { IoFilterSharp } from "react-icons/io5";

const Sorting = ({ limit, setLimit, sorting, setSorting, mobileFilterOpen, setMobileFilterOpen }) => {

    return (
        <div className='flex justify-between items-center flex-wrap bg-gray-50 gap-2 p-4'>
            <Button type='button' className='lg:hidden' variant={'outline'} onClick={() => setMobileFilterOpen(!mobileFilterOpen)}><IoFilterSharp />Filter</Button>
            <ul className='flex items-center gap-4'>
                <li className='font-semibold'>

                </li>
                {
                    [9, 12, 18, 24].map((limitNumber => (
                        <li key={limitNumber}>
                            <button onClick={() => setLimit(limitNumber)} className={`${limitNumber === limit ? 'w-8 h-8 flex justify-center items-center rounded-full bg-primary text-white text-sm cursor-pointer' : 'cursor-pointer'}`}>
                                {limitNumber}
                            </button>
                        </li>
                    )))
                }
            </ul>
            <Select value={sorting} onValueChange={(value) => setSorting(value)}>
                <SelectTrigger className="md:w-[180px] w-full bg-white cursor-pointer">
                    <SelectValue placeholder="Default Sorting" />
                </SelectTrigger>
                <SelectContent >
                    {sortings.map(option => (
                        <SelectItem className='cursor-pointer' key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default Sorting
