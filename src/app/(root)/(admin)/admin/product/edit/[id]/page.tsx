'use client'
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from '@/AdminPanelRoutes'
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
import React, { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from "slugify";
import Select from '@/components/Application/Select'
import Editor from '@/components/Application/Admin/Editor'
import MediaModal from '@/components/Application/Admin/MediaModal'
import Image from 'next/image'


const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PRODUCT_SHOW, label: "Products" },
  { href: '', label: "Edit Product" }
]

const EditProduct = ({ params }) => {

  const { id } = use(params);

  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])

  const [loading, setLoading] = useState(false);
  const [categoryOption, setCategoryOption] = useState([])
  const { data: getCategory } = useFetch('/api/category?deleteType=SD');
  const { data: getProduct, loading: getProductLoading } = useFetch(`/api/product/get/${id}`);

  useEffect(() => {
    if (getCategory && getCategory.success) {
      const data = getCategory.data;
      const options = data.map((cat) => (
        {
          label: cat.name,
          value: cat._id
        }
      ));
      setCategoryOption(options);
    }
  }, [getCategory])

  const formSchema = zSchema.pick({
    _id: true,
    name: true,
    slug: true,
    category: true,
    mrp: true,
    sellingPrice: true,
    discountPercentage: true,
    description: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      name: '',
      slug: '',
      category: '',
      mrp: '',
      sellingPrice: '',
      discountPercentage: 0,
      description: '',
    },
  });



  useEffect(() => {
    if (getProduct?.success) {
      const product = getProduct.data;
      form.reset({
        _id: product?._id || '',
        name: product?.name || "",
        slug: product?.slug || "",
        category: product?.category || "",
        mrp: product?.mrp || "",
        sellingPrice: product?.sellingPrice || "",
        discountPercentage: product?.discountPercentage || "",
        description: product?.description || "",
      });

      if (product.media) {
        const media = product.media.map((media) => ({ _id: media._id, url: media.secure_url }));
        setSelectedMedia(media)
      }
    }
  }, [getProduct, form]);

  //discount percentage calculation
  useEffect(() => {
    const mrp = Number(form.getValues('mrp')) || 0;
    const sellingPrice = Number(form.getValues('sellingPrice')) || 0;

    if (mrp > 0 && sellingPrice > 0) {
      const discountPercentage = ((mrp - sellingPrice) / mrp) * 100;
      form.setValue('discountPercentage', Math.round(discountPercentage));
    } else {
      form.setValue('discountPercentage', 0);
    }
  }, [form.watch('mrp'), form.watch('sellingPrice')]);

  useEffect(() => {
    const name = form.getValues('name');
    if (name) {
      form.setValue('slug', slugify(name).toLowerCase())
    }
  }, [form.watch('name')]);

  const editor = (event, editor) => {
    const data = editor.getData();
    form.setValue('description', data)
  }

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      if (selectedMedia.length <= 0) {
        showToast('error', 'Please select a media');
      }

      const mediaIds = selectedMedia.map(media => media._id);
      values.media = mediaIds;
      const { data: response } = await axios.put('/api/product/update', values);
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
            Edit Product
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter the product name"
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
                    name="slug"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter the product slug"
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
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select
                            options={categoryOption}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
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
                    name="mrp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MRP</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder="Enter the MRP"
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
                    name="sellingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter the selling price"
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
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-5 md:col-span-2">
                  <FormLabel className='mb-2'>Description</FormLabel>
                  {!getProductLoading &&
                    <Editor
                      onChange={editor}
                      initialData={form.getValues("description")}
                    />
                  }

                  <FormMessage />
                </div>
              </div>
              <div className='border border-dashed md:col-span-2 rounded-md p-5 text-center mt-5'>
                <MediaModal
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple={true}
                />

                {
                  selectedMedia.length > 0
                  &&
                  <div className='flex justify-center items-center gap-3 rounded flex-wrap mb-3'>
                    {
                      selectedMedia.map(media => (
                        <div key={media._id} className='w-24 h-24 border'>
                          <Image
                            src={media.url}
                            height={100}
                            width={100}
                            alt=''
                            className='size-full object-cover'
                          />
                        </div>
                      ))
                    }
                  </div>
                }


                <div onClick={() => setOpen(true)} className='bg=gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer rounded-md'>
                  <span className='font-semibold '>Select Media</span>
                </div>
              </div>
              <div>
                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Edit Product"
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

export default EditProduct;
