'use client';

import { Card, CardContent } from '@/components/ui/card';
import React, { useState } from 'react';
import Logo from '../../../../../public/assets/images/logo-black.png';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { zSchema } from '@/lib/zodSchema';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { FaRegEyeSlash } from 'react-icons/fa';
import { FaRegEye } from 'react-icons/fa6';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ButtonLoading } from '@/components/Application/ButtonLoading';
import {
  USER_DASHBOARD,
  WEBSITE_REGISTER,
  WEBSITE_RESETPASSWORD,
} from '@/WebsiteRoute';
import axios from 'axios';
import { showToast } from '@/lib/showToast';
import OTPVerification from '@/components/Application/OTPVerification';
import { useDispatch } from 'react-redux';
import { login } from '@/store/reducer/authSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import { ADMIN_DASHBOARD } from '@/AdminPanelRoutes';

// ✅ Define schema
const formSchema = zSchema.pick({
  email: true,
}).extend({
  password: z.string().min(3, 'Password is required!'),
});

// ✅ Infer TS type
type LoginFormValues = z.infer<typeof formSchema>;

// ✅ OTP type
type OtpValues = {
  email: string;
  otp: string;
};

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [otpVerificationLoading, setOtpVerificationLoading] =
    useState<boolean>(false);
  const [isTypingPassword, setIsTypingPassword] = useState<boolean>(true);
  const [otpEmail, setOtpEmail] = useState<string>('');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // ✅ Login handler
  const handleLoginSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      const { data: loginResponse } = await axios.post('/api/auth/login', values);

      if (!loginResponse.success) {
        throw new Error(loginResponse.message);
      }

      setOtpEmail(values.email);
      form.reset();
      showToast('success', loginResponse.message);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Something went wrong';
      showToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✅ OTP verification handler
  const handleOtpVerification = async (values: OtpValues) => {
    try {
      setOtpVerificationLoading(true);
      const { data: otpResponse } = await axios.post(
        '/api/auth/verify-otp',
        values
      );

      if (!otpResponse.success) {
        throw new Error(otpResponse.message);
      }

      setOtpEmail('');
      showToast('success', otpResponse.message);

      dispatch(login(otpResponse.data));

      if (searchParams.has('callback')) {
        router.push(searchParams.get('callback') as string);
      } else {
        otpResponse.data.role === 'admin'
          ? router.push(ADMIN_DASHBOARD)
          : router.push(USER_DASHBOARD);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Something went wrong';
      showToast('error', errorMessage);
    } finally {
      setOtpVerificationLoading(false);
    }
  };

  return (
    <div>
      <Card className="w-[400px]">
        <CardContent>
          <div className="flex justify-center">
            <Image
              src={Logo}
              alt="Logo"
              width={150}
              height={50}
              className="w-[150px]"
            />
          </div>

          {!otpEmail ? (
            <>
              <div className="flex items-center flex-col">
                <h1 className="font-semibold text-2xl">Login to your Account</h1>
                <p>Login to your account by filling the form below</p>
              </div>

              <div className="mt-3">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleLoginSubmit)}
                    className="space-y-8"
                  >
                    <div className="mt-5">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mb-5">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type={isTypingPassword ? 'password' : 'text'}
                                placeholder="********"
                                {...field}
                              />
                            </FormControl>

                            <button
                              type="button"
                              className="absolute top-[2rem] right-[1rem] cursor-pointer"
                              onClick={() =>
                                setIsTypingPassword(!isTypingPassword)
                              }
                            >
                              {isTypingPassword ? (
                                <FaRegEyeSlash />
                              ) : (
                                <FaRegEye />
                              )}
                            </button>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <ButtonLoading
                        loading={loading}
                        type="submit"
                        text="Login"
                        className="cursor-pointer w-full"
                      />
                    </div>

                    <div className="flex justify-center items-center">
                      <Link
                        href={WEBSITE_RESETPASSWORD}
                        className="text-primary underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    <div className="flex justify-center items-center gap-2">
                      <p>Don’t have an account?</p>
                      <Link
                        href={WEBSITE_REGISTER}
                        className="text-primary underline"
                      >
                        Create One.
                      </Link>
                    </div>
                  </form>
                </Form>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col justify-center items-center">
                <p className="mt-3 text-center ">
                  Enter the OTP sent to your email to complete your verification
                </p>
                <OTPVerification
                  email={otpEmail}
                  onSubmit={handleOtpVerification}
                  loading={otpVerificationLoading}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
