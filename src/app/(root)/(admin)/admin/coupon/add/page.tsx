'use client'
import { ADMIN_DASHBOARD, ADMIN_COUPON_SHOW } from '@/AdminPanelRoutes'
import BreadCrumbs from '@/components/Application/Admin/BreadCrumbs'
import { ButtonLoading } from '@/components/Application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: ADMIN_COUPON_SHOW, label: "Coupons" },
    { href: '', label: "Add Coupon" }
]

const formSchema = zSchema.pick({
    code: true,
    discountPercentage: true,
    minShoppingAmount: true,
    validity: true,
})

const AddCoupon = () => {

    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: '',
            validity: 0,
            discountPercentage: '',
            minShoppingAmount: '',
        },
    });

    const onSubmit = async (values) => {
        setLoading(true);
        try {
            const { data: response } = await axios.post('/api/coupon/create', values);
            if (!response.success) {
                throw new Error(response.message);
            }
            form.reset();
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
                        Add Coupon
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
                                    text="Add Coupon"
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

export default AddCoupon;
