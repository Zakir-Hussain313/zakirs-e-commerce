'use client'
import { ADMIN_DASHBOARD, ADMIN_COUPON_SHOW } from '@/AdminPanelRoutes'
import BreadCrumbs from '@/components/Application/Admin/BreadCrumbs'
import { ButtonLoading } from '@/components/Application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import dayjs from 'dayjs'
import { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_COUPON_SHOW, label: "Coupons" },
  { href: '', label: "Edit Coupon" }
]

const formSchema = zSchema.pick({
  _id: true,
  code: true,
  discountPercentage: true,
  minShoppingAmount: true,
  validity: true,
})

const EditCoupon = ({ params }) => {

  const { id } = use(params);

  const [loading, setLoading] = useState(false);

  const { data: getCouponData } = useFetch(`/api/coupon/get/${id}`);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      validity: 0,
      discountPercentage: '',
      minShoppingAmount: '',
    },
  });

  useEffect(() => {
    if (getCouponData && getCouponData?.success) {
      const coupon = getCouponData.data;
      form.reset({
        _id: coupon?._id || '',
        code: coupon?.code || "",
        validity: dayjs(coupon.validity).format("YYYY-MM-DD"),
        minShoppingAmount: coupon?.minShoppingAmount || "",
        discountPercentage: coupon?.discountPercentage || "",
      });
    }
  }, [getCouponData, form]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data: response } = await axios.put('/api/coupon/update', values);
      if (!response.success) {
        throw new Error(response.message);
      }
      showToast('success', response.message)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <BreadCrumbs breadcrumbData={breadcrumbData} />
      <Card className='media-card rounded-lg shadow-sm'>
        <CardHeader className='px-5 border-b'>
          <h4 className='font-semibold text-xl uppercase'>
            Edit Coupon
          </h4>
        </CardHeader>
        <CardContent className='flex flex-col '>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5">
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter the code"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="minShoppingAmount"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel>Minimum Shopping Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter the Minimum Shopping Amount"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Percentage</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="validity"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel>Validity</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            placeholder="Enter the validity of the coupon"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div>
                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Edit Coupon"
                  className="cursor-pointer mt-5"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditCoupon;
