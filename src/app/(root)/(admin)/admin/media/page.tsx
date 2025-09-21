'use client'
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/AdminPanelRoutes'
import BreadCrumbs from '@/components/Application/Admin/BreadCrumbs'
import Media from '@/components/Application/Admin/Media'
import UploadMedia from '@/components/Application/Admin/UploadMedia'
import { ButtonLoading } from '@/components/Application/ButtonLoading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import useDeleteMutation from '@/hooks/useDeleteMutations'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: '', label: 'Media' }
]

const MediaPage = () => {

    const queryClient = useQueryClient()
    const [deleteType, setDeleteType] = useState('SD')
    const [selectedMedia, setSelectedMedia] = useState([])
    const [selectAll, setSelectAll] = useState(false)

    const searchParams = useSearchParams();
    const deleteMutation = useDeleteMutation('media-data', '/api/media/delete')

    useEffect(() => {
        if (searchParams) {
            const trashOf = searchParams.get('trashof');
            setSelectedMedia([])
            if (trashOf) {
                setDeleteType("PD")
            }
            else {
                setDeleteType("SD")
            }
        }
    }, [searchParams])

    const fetchMedia = async (page, deleteType) => {
        const { data: response } = await axios.get(`/api/media?page=${page}&&limit=10&&deleteType=${deleteType}`);
        return response;
    }

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        status,
    } = useInfiniteQuery({
        queryKey: ['media-data', deleteType],
        queryFn: async ({ pageParam }) => await fetchMedia(pageParam, deleteType),
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => {
            const nextPage = pages.length;
            return lastPage.hasMore ? nextPage : undefined;
        }
    });

    const handleDelete = (ids, deleteType) => {
        let c = {};
        if (deleteType === "PD") {
            c = confirm('Are you sure you want to delete the media permanently?')
        }
        if (c) {
            deleteMutation.mutate({ ids, deleteType });
        }
        setSelectAll(false);
        setSelectedMedia([])
    }

    const handleSelectAll = () => {
        setSelectAll(!selectAll)
    }

    useEffect(() => {
        if (selectAll) {
            const ids = data?.pages.flatMap(page => page.mediaData.map(media => media._id));
            setSelectedMedia(ids);
        } else {
            setSelectedMedia([])
        }
    }, [selectAll])

    return (
        <div>
            <BreadCrumbs breadcrumbData={breadcrumbData} />
            <Card className='media-card rounded-lg shadow-sm'>
                <CardHeader className='py-2 px-5 border-b'>
                    <div className='flex justify-between items-center'>
                        <h4 className='font-semibold text-xl uppercase'>
                            {deleteType === "SD" ? "Media" : "Media Trash"}
                        </h4>
                        <div className='flex items-center gap-5 '>
                            {deleteType === "SD" && <UploadMedia queryClient={queryClient} />}
                            <div className='flex gap-3'>
                                {
                                    deleteType === "SD"
                                        ?
                                        <Button type='button' variant='destructive'>
                                            <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>
                                                Trash
                                            </Link>
                                        </Button>
                                        :
                                        <Button type='button'>
                                            <Link href={`${ADMIN_MEDIA_SHOW}`}>
                                                Back to Media
                                            </Link>
                                        </Button>
                                }
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>

                    {
                        selectedMedia.length > 0
                        &&
                        <div className='py-2 px-3 border flex items-center justify-between mb-2 '>
                            <Label>
                                <Checkbox
                                    className='border-primary cursor-pointer'
                                    checked={selectAll}
                                    onCheckedChange={handleSelectAll}
                                />
                                Select All
                            </Label>
                            <div className='flex gap-2'>
                                {
                                    deleteType === 'SD'
                                        ?
                                        <Button className='cursor-pointer' variant='destructive' onClick={() => handleDelete(selectedMedia, deleteType)}>Move Into Trash</Button>
                                        :
                                        <>
                                            <Button className='bg-green-500 hover:bg-green-600 cursor-pointer' onClick={() => handleDelete(selectedMedia, 'RSD')}>Restore</Button>
                                            <Button className='cursor-pointer' variant='destructive' onClick={() => handleDelete(selectedMedia, deleteType)}>Delete Permanently</Button>
                                        </>
                                }
                            </div>
                        </div>
                    }

                    {status === 'pending'
                        ?
                        <>
                            <div>Loading...</div>
                        </>
                        :
                        status === 'error'
                            ?
                            <div className='text-red-500 text-sm'>{error.message}</div>
                            :
                            <>
                                {
                                    data?.pages
                                        ?.flatMap(page => page.mediaData?.map(media => media._id) || [])
                                        .length === 0 && (
                                        <div>No Media Found</div>
                                    )
                                }
                                <div className='grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-2 mb-5'>
                                    {
                                        data?.pages?.map((page, index) => (
                                            <React.Fragment key={index}>
                                                {
                                                    page?.mediaData?.map((media) => (
                                                        <Media
                                                            key={media._id}
                                                            media={media}
                                                            handleDelete={handleDelete}
                                                            deleteType={deleteType}
                                                            selectedMedia={selectedMedia}
                                                            setSelectedMedia={setSelectedMedia}
                                                        />
                                                    ))
                                                }
                                            </React.Fragment>
                                        ))
                                    }
                                </div>
                            </>
                    }
                    {
                        hasNextPage
                        &&
                        <ButtonLoading
                            type='button'
                            loading={isFetching}
                            onClick={() => fetchNextPage()}
                            text='Load More'
                            className='cursor-pointer'
                        />
                    }
                </CardContent>
            </Card>
        </div>
    )
}

export default MediaPage
