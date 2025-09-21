'use client'

import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import Logo from '../../../../../public/assets/images/logo-black.png'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { zSchema } from '@/lib/zodSchema'
import * as z from 'zod'
import { useForm } from "react-hook-form"
import { FaRegEyeSlash } from "react-icons/fa"
import { FaRegEye } from "react-icons/fa6"
import Link from 'next/link'
import axios from 'axios'
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
import { showToast } from '@/lib/showToast'

// ✅ Define the schema for login
const formSchema = zSchema.pick({
    name: true,
    email: true,
    password: true
}).extend({
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Password and confirm password must contain the same values',
    path: ['confirmPassword']
})

// ✅ Infer TypeScript type from schema
type LoginFormValues = z.infer<typeof formSchema>

const RegisterPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [isTypingPassword, setIsTypingPassword] = useState<boolean>(true)

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
    })

    const handleRegisterSubmit = async (values: LoginFormValues) => {
        try {
            setLoading(true);
            const { data: registerResponse } = await axios.post('/api/auth/register', values);
            if (!registerResponse.success) {
                throw new Error(registerResponse.message)
            }
            form.reset()
          showToast('success' , registerResponse.message );
        }
        catch ( error ) {
            showToast('error' , error.message );
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex justify-center mt-10'>
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
                    <div className='flex items-center flex-col'>
                        <h1 className='font-semibold text-2xl'>Create your Account</h1>
                        <p>Create your account by filling the form below</p>
                    </div>
                    <div className='mt-3'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleRegisterSubmit)} className="space-y-8">
                                <div className='mt-5'>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input type='text' placeholder="John Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
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
                                <div className='mb-5'>
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className='relative'>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type={isTypingPassword ? 'password' : 'text'}
                                                        placeholder="********"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <button
                                                    type='button'
                                                    className='absolute top-[2rem] right-[1rem] cursor-pointer'
                                                    onClick={() => setIsTypingPassword(!isTypingPassword)}
                                                >
                                                    {isTypingPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                                </button>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className='mb-5'>
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem className='relative'>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type={isTypingPassword ? 'password' : 'text'}
                                                        placeholder="********"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <button
                                                    type='button'
                                                    className='absolute top-[2rem] right-[1rem] cursor-pointer'
                                                    onClick={() => setIsTypingPassword(!isTypingPassword)}
                                                >
                                                    {isTypingPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                                </button>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <ButtonLoading
                                        loading={loading}
                                        type='submit'
                                        text='Create Account'
                                        className='cursor-pointer w-full'
                                    />
                                </div>
                                <div className='flex justify-center items-center gap-2'>
                                    <p>Already have an account?</p>
                                    <Link href={WEBSITE_LOGIN} className='text-primary underline'>
                                        Login
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default RegisterPage
