'use client'
import Filter from '@/components/Application/Website/Filter'
import Sorting from '@/components/Application/Website/Sorting'
import WebsiteBreadCrumb from '@/components/Application/Website/WebsiteBreadCrumb'
import { WEBSITE_SHOP } from '@/WebsiteRoute'
import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import useWindowSize from '@/hooks/useWindowSize'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { useInfiniteQuery } from '@tanstack/react-query'
import ProductBox from '@/components/Application/Website/ProductBox'
import { ButtonLoading } from '@/components/Application/ButtonLoading'


const breadcrumb = {
  title: 'shop',
  link: [
    { label: 'Shop', href: WEBSITE_SHOP }
  ]
}

const Shop = () => {

  const [limit, setLimit] = useState(9)
  const [sorting, setSorting] = useState('default_sorting')
  const [isMobileFilter, setIsMobileFilter] = useState(false)
  const windowSize = useWindowSize()
  const searchParams = useSearchParams().toString()

  const fetchProducts = async (pageParam) => {
    const { data: getProduct } = await axios.get(`/api/shop?page=${pageParam}&limit=${limit}&sort=${sorting}&${searchParams}`);

    if (!getProduct.success) {
      return
    }
    return getProduct.data;
  }

  const { error, isFetching, data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['products', limit, sorting, searchParams],
    queryFn: async ({ pageParam }) => await fetchProducts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !("nextPage" in lastPage)) return undefined;
      return lastPage.nextPage;
    }

  })

  return (
    <div>
      <WebsiteBreadCrumb props={breadcrumb} />
      <section className="lg:flex lg:px-32 px-4 my-20">
        {
          windowSize.width > 1024

            ?
            <div className="me-4 w-72">
              <div className="sticky top-0 bg-gray-50 p-4 rounded">
                <Filter />
              </div>
            </div>

            :

            <Sheet open={isMobileFilter} onOpenChange={() => setIsMobileFilter(false)}>
              <SheetContent side='left' className='block'>
                <SheetHeader className='border-b'>
                  <SheetTitle>Filter</SheetTitle>
                </SheetHeader>
                <div className='px-5 overflow-auto h-[calc(100vh-80px)]'>
                  <Filter />
                </div>
              </SheetContent>
            </Sheet>
        }
        <div className='lg:w-[calc(100%-18rem)]'>
          <Sorting
            limit={limit}
            setLimit={setLimit}
            sorting={sorting}
            setSorting={setSorting}
            mobileFilterOpen={isMobileFilter}
            setMobileFilterOpen={setIsMobileFilter}
          />
          {isFetching && <div className="font-semibold p-3 text-center">Loading...</div>}
          {error && <div className='font-semibold p-3 text-center'>{error.message}</div>}

          <div className='grid lg:grid-cols-3 grid-cols-2 lg:gap-10 gap-5 mt-10'>
            {data && data?.pages.map(page => (
              page?.products?.map(product => (
                <ProductBox key={product._id} product={product} />
              ))
            ))}
          </div>
          <div className='flex justify-center mt-10'>
            {hasNextPage
              ?
              <ButtonLoading type='button' loading={isFetching} text='Load More' onClick={fetchNextPage} />
              :
              <>
                {!isFetching
                  &&
                  <span>No more data to load.</span>
                }
              </>
            }
          </div>
        </div>
      </section >
    </div >
  )
}

export default Shop
