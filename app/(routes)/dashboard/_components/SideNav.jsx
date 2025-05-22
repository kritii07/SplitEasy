"use client"
import { UserButton } from '@clerk/nextjs'
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function SideNav() {
    const menuList = [
        {
            id:1,
            name:'Dashboard',
            icon: LayoutGrid,
            path: '/dashboard'
        },
        {
            id:2,
            name:'Budgets',
            icon: PiggyBank,
            path: '/dashboard/budgets'
        },
        {
            id:3,
            name: 'Expenses',
            icon: ReceiptText,
            path: '/dashboard/expenses'
        },
        {
            id:4,
            name:'Group Bills',
            icon: ShieldCheck,
            path: '/dashboard/groupbills'
        }
    ]

    const path = usePathname();

    return (
        <div className='fixed left-0 top-0 h-screen w-72 p-5 border-r shadow-sm bg-gradient-to-b from-purple-50 to-blue-50 flex flex-col z-20'>
            {/* Logo */}
            <div className='p-4 mb-8 pt-6'>  {/* Added pt-6 to account for header height */}
                <Image 
                    src='/spliteasy.png'
                    alt='logo'
                    width={180}
                    height={120}
                    className='object-contain'
                />
            </div>

            {/* Menu Items */}
            <div className='flex-1 space-y-3'>
                {menuList.map((menu)=>(
                    <Link href={menu.path} key={menu.id}>
                        <div className={`flex items-center gap-4 p-4 rounded-xl transition-all text-lg
                            ${path === menu.path 
                                ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold shadow-md'
                                : 'text-gray-700 hover:bg-white hover:text-purple-600 hover:shadow-sm'
                            }`}
                        >
                            <menu.icon className='h-6 w-6'/>
                            <span>{menu.name}</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* User Profile */}
            <div className='mt-auto p-4 border-t border-gray-200'>
                <div className='flex items-center gap-4 p-3 rounded-lg hover:bg-white transition-all'>
                    <div className='relative h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm'>
                        <UserButton appearance={{
                            elements: {
                                userButtonAvatarBox: "h-10 w-10"
                            }
                        }}/>
                    </div>
                    <div className='flex-1'>
                        <p className='text-base font-medium'>Profile</p>
                        <p className='text-sm text-gray-500'>View account</p>
                    </div>
                    <LogOut className='h-5 w-5 text-gray-500' />
                </div>
            </div>
        </div>
    )
}

export default SideNav