"use client"
import Image from 'next/image'
import React from 'react'
import { Button } from '@/components/ui/button'
import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'

function Header() {

  const {user, isSignedIn} = useUser();

  return (
    <div className='p-5 flex justify-between items-center border shadow-sm'>
        <Image src='/spliteasy.png'
        alt ='logo'
        width={160}
        height={100}/>
        {isSignedIn?
        <UserButton/>:
        <Link href={'/sign-in?redirectUrl=/dashboard'}>
        <Button>Ready to Begin?</Button>
        </Link>
        }
    </div>
  )
}

export default Header