import React from 'react'
import CountOverview from './CountOverview'
import QuickAdd from './QuickAdd'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { OrderOverview } from './ChartOverview'
import { OrderStatus } from './OrderStatus'
import LatestOrders from './LatestOrders'
import LatestReview from './LatestReview'

const AdminDashboard = () => {
  return (
    <div className='mt-3'>
      <CountOverview />
      <QuickAdd />
      <div className='mt-10 flex lg:flex-nowrap flex-wrap gap-10'>
        <Card className='rounded-lg lg:w-[70%] w-full p-0'>
          <CardHeader className='py-3 border [.border-b]:pb-3'>
            <div className='flex justify-between items-center px-3 '>
              <span className='font-semibold'>
                Order Overview
              </span>
              <Button className='flex justify-center items-center mt-1'>
                <Link href={''}>View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <OrderOverview />
          </CardContent>
        </Card>
        <Card className='rounded-lg lg:w-[30%] w-full p-0'>
          <CardHeader className='border [.border-b]:pb-3'>
            <div className='flex justify-between items-center px-3 pt-3'>
              <span className='font-semibold'>
                Orders Status
              </span>
              <Button className='flex justify-center items-center mb-1'>
                <Link href={''}>View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <OrderStatus />
          </CardContent>
        </Card>
      </div>
      <div className='mt-10 flex lg:flex-nowrap flex-wrap gap-10'>
        <Card className='rounded-lg lg:w-[30%] w-full p-0 block'>
          <CardHeader className='border [.border-b]:pb-0'>
            <div className='flex justify-between items-center pt-3'>
              <span className='font-semibold'>
                Latest Review
              </span>
              <Button className='flex justify-center items-center mb-1'>
                <Link href={''}>View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className='pt-2 px-1 lg:h-[350px] overflow-auto '>
            <LatestReview />
          </CardContent>
        </Card>
        <Card className='rounded-lg lg:w-[70%] w-full p-0 block'>
          <CardHeader className='py-3 border [.border-b]:pb-3'>
            <div className='flex justify-between items-center px-3 '>
              <span className='font-semibold'>
                Latest Orders
              </span>
              <Button className='flex justify-center items-center mt-1'>
                <Link href={''}>View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className='pt-2 lg:h-[350px] overflow-auto'>
            <LatestOrders />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
