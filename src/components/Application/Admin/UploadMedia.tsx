'use client'

import React from 'react'
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary'
import { Button } from '@/components/ui/button'
import { FilePlus } from 'lucide-react'
import { showToast } from '@/lib/showToast'
import axios from 'axios'

interface UploadMediaProps {
    isMultiple?: boolean
}

const UploadMedia: React.FC<UploadMediaProps> = ({ isMultiple = true , queryClient }) => {
    // Ensure cloud name exists
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
        console.log('CLOUDINARY_CLOUD_NAME is not defined')
        return <p className="text-red-500">Cloudinary is not configured properly.</p>
    }

    // Error handler
    const handleOnError = (error: { statusText?: string } | string) => {
        const message = typeof error === 'string' ? error : error?.statusText || 'Upload failed'
        showToast('error', message)
    }

    // Queue End handler
    const handleOnQueueEnd = async (results: CloudinaryUploadWidgetResults) => {
        try {
            const files = (results?.info?.files || []) as any[]
            const uploadedFiles = files
                .filter(file => file?.uploadInfo)
                .map(file => ({
                    asset_id: file.uploadInfo.asset_id,
                    public_id: file.uploadInfo.public_id,
                    secure_url: file.uploadInfo.secure_url,
                    path: file.uploadInfo.secure_url,
                    thumbnail_url: file.uploadInfo.thumbnail_url,
                }))

            if (uploadedFiles.length === 0) return

            const { data: mediaUploadResponse } = await axios.post('/api/media/create', uploadedFiles)

            if (!mediaUploadResponse.success) {
                throw new Error(mediaUploadResponse.message || 'Media upload failed')
            }
            queryClient.invalidateQueries(['meta-data'])
            showToast('success', mediaUploadResponse.message)
        } catch (error: any) {
            showToast('error', error?.message || 'Something went wrong during upload')
            console.error(error)
        }
    }

    return (
        <CldUploadWidget
            signatureEndpoint="/api/cloudinary-signature"
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPDATE_PRESET as string}
            onError={handleOnError}
            onQueuesEnd={handleOnQueueEnd}
            options={{
                multiple: isMultiple,
                sources: ['local', 'camera', 'google_drive', 'unsplash', 'url'],
            }}
        >
            {({ open }) => (
                <Button
                    type="button"
                    onClick={() => open?.()}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <FilePlus size={18} />
                    Upload Media
                </Button>
            )}
        </CldUploadWidget>
    )
}

export default UploadMedia
