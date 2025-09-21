"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card , CardContent } from "@/components/ui/card";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import verifiedImg from '../../../../../../public/assets/images/verified.gif'
import verificationFailedImg from '../../../../../../public/assets/images/verification-failed.gif'
import { WEBSITE_LOGIN, WEBSITE_REGISTER } from "@/WebsiteRoute";


export default function VerifyEmailPage() {
    const { token } = useParams<{ token: string }>();
    const [isVerified, setIsVerified] = useState(false)

    useEffect(() => {
        const verify = async () => {
            const { data: verificationResponse } = await axios.post('/api/auth/verify-email', { token });

            if (verificationResponse.success) {
                setIsVerified(true);
            }
        }
        verify();
    }, [token])

    return (
        <Card className="flex justify-center items-center h-screen w-screen">
            <CardContent className="w-[400px]">
        {isVerified ?
            <div>
                <div className="flex justify-center items-center">
                    <Image src={verifiedImg.src} alt='' height={100} width={100} />
                </div>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-green-500 my-5">Verified Successfully!</h1>
                    <Button asChild>
                        <Link href={WEBSITE_LOGIN}>Login to Continue Shopping</Link>
                    </Button>
                </div>
            </div>
            :
            <div>
                <div className="flex justify-center items-center">
                    <Image src={verificationFailedImg.src} alt='' height={100} width={100} />
                </div>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500">Verification Failed!</h1>
                    <Button asChild>
                        <Link href={WEBSITE_REGISTER}>SignUp to Verify</Link>
                    </Button>
                </div>
            </div>
        }
            </CardContent>
        </Card>
    );
}
