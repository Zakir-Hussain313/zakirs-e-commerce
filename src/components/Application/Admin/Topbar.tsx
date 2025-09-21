'use client'
import { Button } from "@/components/ui/button";
import ThemeSwitch from "./ThemeSwitch";
import UserDropdown from "./UserDropdown";
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from "@/components/ui/sidebar";
import AdminSearch from "./AdminSearch";
import logoBlack from '../../../../public/assets/images/logo-black.png'
import logoWhite from '../../../../public/assets/images/logo-white.png'
import Image from "next/image";
import AdminMobileSearch from "./AdminMobileSearch";

export default function Topbar() {

    const { toggleSidebar } = useSidebar()

    return (
        <>
            <div className="fixed border h-14 top-0 left-0 z-30 px-5 flex justify-between items-center bg-white dark:bg-card w-full md:w-[calc(100%-15rem)] md:left-60">
                <div className="flex items-center md:hidden">
                    <Image src={logoBlack.src} height={100} width={100} className="block dark:hidden" alt="Logo" />
                    <Image src={logoWhite.src} height={100} width={100} className="dark:block hidden" alt="Logo" />
                </div>
                <div className="md:block hidden">
                    <AdminSearch />
                </div>
                <div className="flex items-center gap-5">
                    <AdminMobileSearch />
                    <ThemeSwitch />
                    <UserDropdown />
                    <Button onClick={toggleSidebar} type="button" size='icon' className="ms-2 md:hidden">
                        <RiMenu4Fill />
                    </Button>
                </div>
            </div>

        </>
    )
}

