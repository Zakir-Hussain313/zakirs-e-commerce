"use client"

import * as React from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import adminLogo from '../../../../public/assets/images/favicon.ico'
import { useSelector } from "react-redux"
import { RootState } from "@/store/store";
import Link from "next/link"
import { IoShirtOutline } from "react-icons/io5"
import { MdOutlineShoppingBag } from "react-icons/md"
import LogoutButton from "./LogoutButton"
export default function UserDropdown() {

    const user = useSelector((state: RootState) => state.auth);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                    <AvatarImage src={adminLogo.src} />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 me-5">
                <DropdownMenuLabel>
                    <p className="font-semibold">{user?.name}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={''} className="cursor-pointer flex gap-3 items-center">
                        <IoShirtOutline />
                        New Product
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={''} className="cursor-pointer flex gap-3 items-center">
                        <MdOutlineShoppingBag/>
                        Orders
                    </Link>
                </DropdownMenuItem>
                <LogoutButton />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
