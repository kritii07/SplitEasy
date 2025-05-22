import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 z-0" />
      
      <section className="relative flex flex-col items-center px-4 py-24 md:py-32">
        
        <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-12 z-10">
          
          <div className="lg:w-1/2 text-center lg:text-left space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-800">Manage Your </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Expenses
              </span>
              <br />
              <span className="text-gray-800">Control Your </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Money
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
              Start creating your budget and save tons of money with our intuitive expense tracking system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                asChild
                className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all hover:shadow-xl text-white"
              >
                <a href="/dashboard">
                  Unleash Your Dashboard
                </a>
              </Button>
            </div>
          </div>

         
          <div className="lg:w-1/2 relative w-full max-w-4xl">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border-8 border-white ring-1 ring-gray-200 transform hover:scale-[1.02] transition-all duration-300">
              <Image 
                src='/Dashboard.png'
                alt='Expense Tracker Dashboard Preview'
                width={1200}  
                height={800}  
                className="w-full h-auto object-contain"
                priority
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
            </div>
          </div>
        </div>

        
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-indigo-100 blur-3xl opacity-40 z-0" />
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-40 z-0" />
      </section>
    </div>
  )
}

export default Hero