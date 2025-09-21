import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import loading from '../../../../public/assets/images/loading.svg'
import Image from 'next/image'
import ModalMediaBlock from './ModalMediaBlock'
import { showToast } from '@/lib/showToast'
import { ButtonLoading } from '../ButtonLoading'

const MediaModal = ({ open, setOpen, selectedMedia, setSelectedMedia, isMultiple }) => {

    const [previouslySelected, setPreviouslySelected] = useState([])

    const fetchMedia = async (page) => {
        const { data: response } = await axios.get(`/api/media?page=${page}&&limit=18&&deleteType=SD`);
        return response;
    }

    const { isPending, isError, error, data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['MediaModal'],
        queryFn: async ({ pageParam }) => await fetchMedia(pageParam),
        placeholderData: keepPreviousData,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length;
            return lastPage.hasMore ? nextPage : undefined;

        }
    })

    const handleClear = () => {
        setSelectedMedia([]);
        setPreviouslySelected([]);
        showToast('success' , 'Media selection cleared successfully')
    }

    const handleClose = () => {
        setSelectedMedia(previouslySelected)
        setOpen(false)
    }

    const handleSelect = () => {
        if(selectedMedia.length <= 0 ){
            showToast('error' , 'Please select a media');
        }
        setPreviouslySelected(selectedMedia);
        setOpen(false)
    }

    return (
        <div>
            <Dialog
                open={open}
                onOpenChange={() => setOpen(!open)}
            >
                <DialogContent
                    onInteractOutside={(e) => e.preventDefault()}
                    className='bg-transparent border-0 sm:max-w-[80%] h-screen p-0 py-10 shadow-none'
                >
                    <DialogDescription className='hidden'></DialogDescription>

                    <div className='bg-white h-[90vh] p-3 rounded shadow'>
                        <DialogHeader className='h-8 border-b'>
                            <DialogTitle>
                                Media Selection
                            </DialogTitle>
                        </DialogHeader>

                        <div className='h-[calc(100%-80px)] overflow-auto py-2'>
                            {
                                isPending
                                    ?
                                    <div className='size-full flex justify-center items-center'>
                                        <Image
                                            src={loading.src}
                                            alt='Loading...'
                                            height={80}
                                            width={80}

                                        />
                                    </div>
                                    :
                                    isError
                                        ?
                                        <div className='size-full flex justify-center items-center'>
                                            <span className='text-red-500'>{error.message}</span>
                                        </div>
                                        :
                                        <>
                                            <div className='grid lg:grid-cols-4 grid-cols-2 gap-3'>
                                                {
                                                    data?.pages?.map((page, index) => (
                                                        <React.Fragment key={index}>
                                                            {
                                                                page?.mediaData?.map((media) => (
                                                                    <ModalMediaBlock
                                                                        key={media._id}
                                                                        media={media}
                                                                        selectedMedia={selectedMedia}
                                                                        setSelectedMedia={setSelectedMedia}
                                                                        isMultiple={isMultiple}
                                                                    />
                                                                ))
                                                            }
                                                        </React.Fragment>
                                                    ))
                                                }
                                            </div>
                                            {
                                                hasNextPage 
                                                &&
                                                <div className='flex justify-center py-5'>
                                                    <ButtonLoading 
                                                    type='button'
                                                    loading={isFetching}
                                                    text='Load More'
                                                    onClick={() => fetchNextPage()}
                                                    />
                                                </div>
                                            }
                                        </>
                            }
                        </div>

                        <div className='h-10 pt-3 border-t flex justify-between'>
                            <div>
                                <Button type='button' variant={'destructive'} onClick={handleClear} className='cursor-pointer'>
                                    Clear All
                                </Button>
                            </div>
                            <div className='flex gap-5'>
                                <Button type='button' variant='secondary' onClick={handleClose} className='cursor-pointer'>
                                    Close
                                </Button>
                                <Button type='button' onClick={handleSelect} className='cursor-pointer'>
                                    Select
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MediaModal
