import { UserButton } from '@clerk/nextjs'
import React from 'react'

function DashboardHeader() {
  return (
    <div className='p-5 font-bold shadow-sm border-b flex justify-between'>
        <div className='pl-[490px] text-lg'>
        Where Did Your Money Go?
        </div>
        <div>
           <UserButton/>
        </div>
    </div>
  )
}

export default DashboardHeader
