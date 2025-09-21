"use client"

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { showToast } from '@/lib/showToast'
import { logout } from '@/store/reducer/authSlice'
import { WEBSITE_LOGIN } from '@/WebsiteRoute'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useDispatch } from 'react-redux'

const LogoutButton = () => {

    const dispatch = useDispatch()
    const router = useRouter()

    const handleLogout = async () => {
        try{
            const { data : logoutResponse } = await axios.post('/api/auth/logout');
            if(!logoutResponse.success){
                throw new Error(logoutResponse.message);
            }

            showToast('success', logoutResponse.message);
            dispatch(logout());
            router.push(WEBSITE_LOGIN)
        }
        catch ( error : any ){
            showToast('error' , error.message)
        }
    }

    return (
        <div>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex gap-3 items-center">
                <AiOutlineLogout color='red'/>
                Logout
            </DropdownMenuItem>
        </div>
    )
}

export default LogoutButton
