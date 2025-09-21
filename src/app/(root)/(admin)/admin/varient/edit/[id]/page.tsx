'use client'
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_VARIENT_SHOW } from '@/AdminPanelRoutes'
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
import { sizes } from '@/lib/utils'


const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PRODUCT_VARIENT_SHOW, label: "Product Varients" },
  { href: '', label: "Edit Product Varient" }
]

const formSchema = zSchema.pick({
  product: true,
  color: true,
  size: true,
  sku: true,
  mrp: true,
  sellingPrice: true,
  discountPercentage: true,
})


const EditProductVarient = ({ params }) => {

  const { id } = use(params);

  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])

  const [loading, setLoading] = useState(false);
  const [productOption, setProductOption] = useState([])
  const { data: getProduct } = useFetch('/api/product?deleteType=SD');
  const { data: getProductVarient, loading: getProductLoading } = useFetch(`/api/varient/get/${id}`);

  useEffect(() => {
    if (getProduct && getProduct.success) {
      const data = getProduct.data;
      const options = data.map((product) => (
        {
          label: product.name,
          value: product._id
        }
      ));
      setProductOption(options);
    }
  }, [getProduct]);


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: '',
      sku: '',
      color: '',
      mrp: '',
      sellingPrice: '',
      discountPercentage: '',
      size: '',
    },
  });

  useEffect(() => {
    if (getProductVarient?.success) {
      const product = getProductVarient.data;
      form.reset({
        product: product?.product || "",
        size: product?.size || "",
        sku: product?.sku || "",
        color: product?.color || "",
        mrp: product?.mrp || "",
        sellingPrice: product?.sellingPrice || "",
        discountPercentage: product?.discountPercentage || ""
      });

      if (product.media) {
        const media = product.media.map((media) => ({ _id: media._id, url: media.secure_url }));
        setSelectedMedia(media)
      }
    }
  }, [getProductVarient, form]);

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


  const onSubmit = async (values) => {
    setLoading(true);
    try {
      if (selectedMedia.length <= 0) {
        showToast('error', 'Please select a media');
        return; // stop execution if no media
      }

      const mediaIds = selectedMedia.map(media => media._id);

      // attach _id and media to values
      const payload = {
        ...values,
        _id: id,
        media: mediaIds,
      };

      console.log("Update payload:", payload);


      const { data: response } = await axios.put('/api/varient/update', payload);

      if (!response.success) {
        throw new Error(response.message);
      }

      showToast('success', response.message);
    } catch (error) {
      showToast('error', error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <BreadCrumbs breadcrumbData={breadcrumbData} />
      <Card className='media-card rounded-lg shadow-sm'>
        <CardHeader className='px-5 border-b'>
          <h4 className='font-semibold text-xl uppercase'>
            Edit Product Varient
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
                    name="product"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <FormControl>
                          <Select
                            options={productOption}
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
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter the sku"
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
                    name="color"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter the color"
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
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <FormControl>
                          <Select
                            options={sizes}
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
                  text="Edit Product Varient"
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

export default EditProductVarient;
