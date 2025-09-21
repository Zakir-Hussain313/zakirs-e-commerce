'use client'
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from '@/AdminPanelRoutes'
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
import { useRouter } from 'next/navigation'
import React, { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from "slugify";


const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_CATEGORY_SHOW, label: "Category" },
  { href: '', label: "Edit" }
]

const formSchema = zSchema.pick({
  _id : true,
  name: true,
  slug: true
})

const EditCategory = ({ params }) => {

  const router = useRouter()

  const { id } = use(params);
  const { data: categoryData } = useFetch(`/api/category/get/${id}`)

  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id : id,
      name: '',
      slug: ''
    },
  });

  useEffect(() => {
    const name = form.getValues('name');
    if (name) {
      form.setValue('slug', slugify(name).toLowerCase())
    }
  }, [form.watch('name')]);


  useEffect(() => {
    if (categoryData && categoryData.success) {
      const data = categoryData.data;
      form.reset({
        name: data.name,
        slug: data.slug
      })
    }
  }, [categoryData])

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data: response } = await axios.put('/api/category/update', values);
      if (!response.success) {
        throw new Error(response.message);
      }
      form.reset();
      showToast('success', response.message);
      router.push(ADMIN_CATEGORY_SHOW)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <BreadCrumbs breadcrumbData={breadcrumbData} />
      <Card className='media-card rounded-lg shadow-sm max-w-lg'>
        <CardHeader className='px-5 border-b'>
          <h4 className='font-semibold text-xl uppercase'>
            Edit Category
          </h4>
        </CardHeader>
        <CardContent className='flex flex-col max-w-lg'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div className="mt-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter the category name"
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
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter the category slug"
                          {...field}
                        />
                      </FormControl>

                      <button
                        type="button"
                        className="absolute top-[2rem] right-[1rem] cursor-pointer"
                      >
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
                  text="Update Category"
                  className="cursor-pointer mt-3"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditCategory;
