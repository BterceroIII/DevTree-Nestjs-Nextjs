"use client"

import { usePathname } from "next/navigation"
import Logo from "./Logo"
import AdminNavigation from "./nav/AdminNavigation"
import HomeNavigation from "./nav/HomeNavigation"

export default function Header() {

    const pathname = usePathname()

    return (
        <header className="bg-slate-800 py-5">
            <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center md:justify-between">
                <div className="w-full p-5 lg:p-0 md:w-1/3">
                    <Logo />
                </div>
                <nav className="md:w-1/3 md:flex md:justify-end">
                    {pathname === '/' ? <HomeNavigation /> : <AdminNavigation />}
                </nav>
            </div>
        </header>
    )
}