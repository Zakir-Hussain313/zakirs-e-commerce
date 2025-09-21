'use client'

import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { zSchema } from '@/lib/zodSchema'
import * as z from 'zod'
import { useForm } from "react-hook-form"
import { FaRegEyeSlash } from "react-icons/fa"
import { FaRegEye } from "react-icons/fa6"
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
import { showToast } from '@/lib/showToast'
import { useRouter } from 'next/navigation'
import { WEBSITE_LOGIN } from '@/WebsiteRoute'

// ✅ Define the schema for login
const formSchema = zSchema.pick({
    email : true , password: true
}).extend({
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Password and confirm password must contain the same values',
    path: ['confirmPassword']
})

// ✅ Infer TypeScript type from schema
type LoginFormValues = z.infer<typeof formSchema>

const UpdatePassword: React.FC = ({ email }) => {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [isTypingPassword, setIsTypingPassword] = useState<boolean>(true)

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email : email,
            password: '',
            confirmPassword: ''
        },
    })

    const handlePasswordUpdate = async (values: LoginFormValues) => {
        try {
            setLoading(true);
            const { data: passwordUpdate } = await axios.put('/api/auth/reset-password/update-password', values);
            if (!passwordUpdate.success) {
                throw new Error(passwordUpdate.message)
            }
            form.reset()
            showToast('success', passwordUpdate.message);
            router.push(WEBSITE_LOGIN)
        }
        catch (error) {
            showToast('error', error.message);
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex justify-center'>
                <CardContent>
                    <div className='flex items-center flex-col'>
                        <h1 className='font-semibold text-2xl'>Update Password</h1>
                        <p>Create new password by filling the form below</p>
                    </div>
                    <div className='mt-3'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handlePasswordUpdate)} className="space-y-8">
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
                                        text='Reset Password'
                                        className='cursor-pointer w-full'
                                    />
                                </div>
                            </form>
                        </Form>
                    </div>
                </CardContent>
        </div>
    )
}

export default UpdatePassword
