"use client"

import { Button } from '@/components/ui/button'
import { PenBox } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { useUser } from '@clerk/nextjs'
import { Input } from '@/components/ui/input'
import { db } from '@/utils/dbConfig'
import { eq } from 'drizzle-orm'
import { Budgets } from '@/utils/schema'
import { toast } from 'sonner'

function EditBudget({budgetInfo, refreshData}) {

    const[emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon);
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

    const[name, setName] = useState();
    const[amount, setAmount] = useState();

    const{user}= useUser();

    useEffect(()=>{
        if(budgetInfo){
            setEmojiIcon(budgetInfo?.icon)
            setAmount(budgetInfo.amount)
            setName(budgetInfo.name)
        }
        
    },[budgetInfo])

    const onUpdateBudget=async()=>{
        const result = await db.update(Budgets).set({
            name:name,
            amount:amount,
            icon:emojiIcon
        }).where(eq(Budgets.id,budgetInfo.id))
        .returning();

        if(result){
            refreshData();
            toast('Budget Updated!')
        }
    }

    // if (!budgetInfo) {
    //     return <div className='text-sm'>Loading...</div>;
    // }

  return (
    <div>

    <Dialog>
    <DialogTrigger asChild>
    <Button className="flex gap-2"> <PenBox/> Edit</Button>
    </DialogTrigger>
    <DialogContent>
    <DialogHeader>
        <DialogTitle>Update Budget</DialogTitle>
        <DialogDescription>
        <div className='mt-5'>
        <Button variant="outline" className='text-lg' onClick={()=>setOpenEmojiPicker(!openEmojiPicker)}
        >{emojiIcon}
        </Button>
        <div className='absolute z-20'>
            <EmojiPicker
            open={openEmojiPicker}
            onEmojiClick={(e)=>{
                setEmojiIcon(e.emoji)
                setOpenEmojiPicker(false)
            }}
            />
        </div>
        <div className='mt-2'>
            <h2 className='text-black font-medium my-1'>Budget Name</h2>
            <Input placeholder="e.g. Home Decor"
            defaultValue={budgetInfo?.name}
            onChange={(e)=>setName(e.target.value)}/>
        </div>
        <div>
            <h2 className='text-black font-medium my-1'>Budget Amount</h2>
            <Input
            type="number"
            defaultValue = {budgetInfo?.amount}
            placeholder="e.g. $5000"
            onChange={(e)=>setAmount(e.target.value)}/>
        </div>

       
        </div>
        </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
        <Button 
        disabled={!(name&&amount)}
        onClick={()=>onUpdateBudget()}
        className='mt-5 w-full'>Update Budget
        </Button>
        </DialogClose>
        </DialogFooter>
        </DialogContent>
        </Dialog>

    </div>
  )
}

export default EditBudget