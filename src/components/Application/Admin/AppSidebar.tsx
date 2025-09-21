'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"
import logoBlack from '../../../../public/assets/images/logo-black.png'
import logoWhite from '../../../../public/assets/images/logo-white.png'
import { Button } from "@/components/ui/button"
import { LuChevronRight } from "react-icons/lu"
import { IoMdClose } from "react-icons/io"
import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"

export default function AppSidebar() {

    const { toggleSidebar } = useSidebar()

  return (
    <Sidebar className="z-50">
      <SidebarHeader className="border-b p-0 h-14">
        <div className="flex justify-between items-center px-4 py-2">
          <Image src={logoBlack.src} height={100} width={100} className="block dark:hidden" alt="Logo" />
          <Image src={logoWhite.src} height={100} width={100} className="dark:block hidden" alt="Logo" />
          <Button onClick={toggleSidebar} size='icon' className="cursor-pointer md:hidden" type="button">
            <IoMdClose />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarMenu>
          {adminAppSidebarMenu.map((menu, index) => (
            <Collapsible key={index} className="group/collapsible">
              <SidebarMenuItem>
                {menu.submenu && menu.submenu.length > 0 ? (
                  // ✅ Parent with submenu (toggle only, not a link)
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="font-semibold px-2 py-5">
                      <div className="flex items-center w-full">
                        <menu.icon />
                        <span className="ml-2">{menu.title}</span>
                        <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                ) : (
                  // ✅ Parent with NO submenu (direct link)
                  <SidebarMenuButton asChild className="font-semibold px-2 py-5">
                    <Link href={menu.url}>
                      <menu.icon />
                      <span className="ml-2">{menu.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}

                {/* ✅ Submenu rendering */}
                {menu.submenu && menu.submenu.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {menu.submenu.map((subMenuItem, subMenuIndex) => (
                        <SidebarMenuSubItem key={subMenuIndex}>
                          <SidebarMenuSubButton asChild className="px-2 py-5">
                            <Link href={subMenuItem.url}>
                              {subMenuItem.title}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
