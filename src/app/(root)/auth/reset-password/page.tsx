'use client'

import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import Logo from '../../../../../public/assets/images/logo-black.png'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { zSchema } from '@/lib/zodSchema'
import { useForm } from "react-hook-form"
import Link from 'next/link'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ButtonLoading } from '@/components/Application/ButtonLoading'
import { WEBSITE_LOGIN } from '@/WebsiteRoute'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import OTPVerification from '@/components/Application/OTPVerification'
import UpdatePassword from '@/components/Application/UpdatePassword'

const ResetPassword = () => {

    const [emailVerificationLoading, setEmailVerificationLoading] = useState(false)
    const [otpVerificationLoading, setOtpVerificationLoading] = useState<boolean>(false)
    const [otpEmail, setOtpEmail] = useState<string>('')
    const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false)

    const formSchema = zSchema.pick({ email: true });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });

    const handleEmailVerification = async (values) => {
        try {
            setEmailVerificationLoading(true);
            const { data: sendOtpResponse } = await axios.post('/api/auth/reset-password/send-otp', values);
            if (!sendOtpResponse.success) {
                throw new Error(sendOtpResponse.message)
            }
            setOtpEmail(values.email)
            showToast('success', sendOtpResponse.message);
        }
        catch (error) {
            showToast('error', error.message);
        }
        finally {
            setEmailVerificationLoading(false)
        }
    }

    const handleOtpVerification = async (values) => {
        try {
            setOtpVerificationLoading(true);
            const { data: otpResponse } = await axios.post('/api/auth/reset-password/verify-otp', values);
            if (!otpResponse.success) {
                throw new Error(otpResponse.message)
            }
            showToast('success', otpResponse.message);
            setIsOtpVerified(true)
        }
        catch (error) {
            showToast('error', error.message);
        }
        finally {
            setOtpVerificationLoading(false)
        }
    }

    return (
        <div className='flex justify-center mt-30'>
            <Card className='w-[400px]'>
                <CardContent>
                    <div className='flex justify-center'>
                        <Image
                            src={Logo}
                            alt='Logo'
                            width={150}
                            height={50}
                            className='w-[150px]'
                        />
                    </div>
                    {!otpEmail
                        ?
                        <>
                            <div className='flex items-center flex-col'>
                                <h1 className='font-semibold text-2xl'>Reset Password</h1>
                                <p>Enter your email in order to reset your password</p>
                            </div>
                            <div className='mt-3'>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleEmailVerification)} className="space-y-8">
                                        <div className='mt-5'>
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input type='email' placeholder="@example.com" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <ButtonLoading
                                                loading={emailVerificationLoading}
                                                type='submit'
                                                text='Verify Email'
                                                className='cursor-pointer w-full'
                                            />
                                        </div>
                                        <div className='flex justify-center items-center gap-2'>
                                            <Link href={WEBSITE_LOGIN} className='text-primary underline'>
                                                Back to Login Page
                                            </Link>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        </>
                        :
                        <>
                            {!isOtpVerified
                                ?
                                <>
                                    <div className=' flex flex-col justify-center items-center'>
                                        <p className='mt-3 text-center '>Enter the OTP sent to your email to complete your verification</p>
                                        <OTPVerification email={otpEmail} onSubmit={handleOtpVerification} loading={otpVerificationLoading} />
                                    </div>
                                </>
                                :
                                <>
                                    <UpdatePassword email={otpEmail} />
                                </>
                            }
                        </>}
                </CardContent>
            </Card>
        </div>
    )
}

export default ResetPassword
