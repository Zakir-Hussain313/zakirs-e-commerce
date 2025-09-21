'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import SearchModel from './SearchModel'

const AdminMobileSearch = () => {

    const [ open , setOpen ] = useState(false)

  return (
    <>
      <Button type='button' size={'icon'} onClick={() => setOpen(true)} variant={'ghost'} className='md:hidden'>
            <IoIosSearch />
      </Button>
      <SearchModel open={open} setOpen={setOpen}/>
    </>
  )
}

export default AdminMobileSearch
