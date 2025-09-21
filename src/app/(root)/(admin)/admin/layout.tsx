import AppSidebar from '@/components/Application/Admin/AppSidebar'
import { ThemeProvider } from '@/components/Application/Admin/ThemeProvider'
import Topbar from '@/components/Application/Admin/Topbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
                <AppSidebar />
                <main className="md:w-[calc(100vw-16rem)]">
                    <div className="px-8 pt-[70px] min-h-[calc(100vh-40px)] pb-10">
                        <Topbar />
                        {children}
                    </div>
                </main>
            </SidebarProvider>
        </ThemeProvider>
    )
}

export default AdminDashboardLayout
