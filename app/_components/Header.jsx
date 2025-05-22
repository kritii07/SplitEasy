"use client"
import Image from 'next/image'
import React from 'react'
import { Button } from '@/components/ui/button'
import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'

function Header() {
  const {user, isSignedIn} = useUser();

  return (
    <nav className="sticky top-0 z-50  shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with hover effect */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Image 
              src='/spliteasy.png'
              alt='logo'
              width={160}
              height={60}
              className="group-hover:opacity-90 transition-opacity "
            />
          </Link>

          {/* Navigation items */}
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-6">
                <Link href="/dashboard" className="text-gray-800 hover:text-indigo-700 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-white/50">
                  Dashboard
                </Link>
                <Link href="/dashboard/groupbills" className="text-gray-800 hover:text-indigo-700 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-white/50">
                  Groups
                </Link>
                <div className="ml-4 flex items-center">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "h-9 w-9 border-2 border-white/80 shadow-md",
                        userButtonPopoverCard: "shadow-xl border border-gray-200"
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              <Link href={'/sign-in?redirectUrl=/dashboard'}>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all px-6 py-2">
                  Ready to Begin?
                  <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                    Get Started
                  </span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header