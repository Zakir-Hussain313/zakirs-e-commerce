import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import React, { useState } from 'react'

const ModalMediaBlock = ({ media, selectedMedia, setSelectedMedia, isMultiple }) => {

    const handleCheck = () => {
        let newSelectedMedia = [];
        const isSelected = selectedMedia.find(m => m._id === media._id) ? true : false
        if (isMultiple) {
            // select multiple media
            if (isSelected) {
                //remove selected media from array
                newSelectedMedia = selectedMedia.filter(m => m._id !== media._id)
            }
            else {
                //add new media to array
                newSelectedMedia = [...selectedMedia, {
                    _id: media._id,
                    url: media.secure_url
                }]
            }

            setSelectedMedia(newSelectedMedia)
        }
        else {
            //select single media
            setSelectedMedia([{ _id: media._id, url: media.secure_url }])
        }
    }

    return (
        <label htmlFor={media._id} className='relative group border border-gray-200 dark:border-gray-800 rounded overflow-hidden'>
            <div className='absolute left-2 top-2 z-20'>
                <Checkbox id={media._id} checked={selectedMedia.find(m => m._id === media._id) ? true : false}
                    onClick={handleCheck}
                    className='border-primary cursor-pointer' />
            </div>
            <div className='size-full relative'>
                <Image
                    src={media.secure_url}
                    alt={media.alt || 'Image'}
                    height={300}
                    width={300}
                    className='object-cover md:h-[150px] h-[100px]'
                />
            </div>
        </label>
    )
}

export default ModalMediaBlock
