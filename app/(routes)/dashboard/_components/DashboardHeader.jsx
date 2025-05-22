"use client"
import { ArrowLeft, Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

function DashboardHeader({ showBackButton = false }) {
  const router = useRouter()

  return (
    <header className="fixed top-0 left-72 right-0 z-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white h-16 flex items-center pl-6 pr-4 ">
      <div className="flex items-center gap-4 w-full">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-white/20 text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        )}
        
        <div className="flex items-center gap-3">
          <Wallet className="h-6 w-6 text-white" />
          <h1 className="text-xl font-bold">
            Where Did Your Money Go?
          </h1>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader