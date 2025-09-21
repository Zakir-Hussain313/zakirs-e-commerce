"use client"
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BsSunFill } from 'react-icons/bs';
import { BsMoonFill } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

const ThemeSwitch = () => {
    const { setTheme } = useTheme()
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button type='button' variant='ghost' className='cursor-pointer'>
                        <BsSunFill className='block dark:hidden' />
                        <BsMoonFill className='hidden dark:block' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default ThemeSwitch
