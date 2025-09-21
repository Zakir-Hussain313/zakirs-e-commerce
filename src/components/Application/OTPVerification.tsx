import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ButtonLoading } from "./ButtonLoading";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../ui/input-otp";

// ✅ Pick only otp + email from your zod schema
const formSchema = zSchema.pick({
  otp: true,
  email: true,
});

// ✅ Infer TypeScript type from zod schema
type OTPFormValues = z.infer<typeof formSchema>;

interface OTPVerificationProps {
  email: string;
  loading: boolean;
  onSubmit: (values: OTPFormValues) => void | Promise<void>;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onSubmit,
  loading,
}) => {

  const [isResendingOTP, setIsResendingOTP] = useState<boolean>(false)

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      email,
    },
  });

  const handleOtpVerification = async (values: OTPFormValues) => {
    await onSubmit(values);
  };

  const resendOTP = async () => {
    try {
      setIsResendingOTP(true);
      const { data: resendOtpResponse } = await axios.post('/api/auth/resend-otp', {email});
      if (!resendOtpResponse.success) {
        throw new Error(resendOtpResponse.message)
      }
      showToast('success', resendOtpResponse.message);
    }
    catch (error) {
      showToast('error', error.message);
    }
    finally {
      setIsResendingOTP(false)
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleOtpVerification)}
          className="space-y-8"
        >
          <div className="mt-5">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot className="text-xl size-10" index={0} />
                        <InputOTPSlot className="text-xl size-10" index={1} />
                        <InputOTPSlot className="text-xl size-10" index={2} />
                        <InputOTPSlot className="text-xl size-10" index={3} />
                        <InputOTPSlot className="text-xl size-10" index={4} />
                        <InputOTPSlot className="text-xl size-10" index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <ButtonLoading
              loading={loading}
              type="submit"
              text="Verify"
              className="cursor-pointer w-full"
            />
          </div>

          <div className="text-center mb-2">
            {!isResendingOTP
              ?
              <button
                type="button"
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={resendOTP}
              >
                Resend OTP
              </button>
              :
              <span>Resending...</span>
            }
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OTPVerification;
