"use client";

import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { useAuthHydration } from "@/hooks/useAuthHydration";

interface DashboardLayoutProps {
    children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    useAuthHydration()

    return (
        <div className="min-h-screen bg-neutral-100">
            <div className="flex w-full h-full">
                <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
                    <Sidebar/>
                </div>
                <div className="lg:pl-[264px] w-full h-full">
                    <div className="mx-auto max-x-screen-2xl h-full">
                        <Navbar/>
                        <main className="h-full py-8 px-6 flex flex-col">
                            { children }
                        </main>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout;