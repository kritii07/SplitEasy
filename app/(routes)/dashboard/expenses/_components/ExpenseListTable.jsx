import { db } from '@/utils/dbConfig'
import { Expenses } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

function ExpenseListTable({expensesList,refreshData}) {

    const deleteExpense=async(expense)=>{
         const result = await db.delete(Expenses)
         .where(eq(Expenses.id, expense.id))
         .returning();

         if(result){
            toast('Expense Deleted!');
            refreshData();
         }
    }
  return (
    <div className='mt-6'>
      <h2 className='text-2xl font-bold text-gray-800 mb-4 rounded-xl'>Latest Expenses</h2>
       <div className='grid grid-cols-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-xl'>
                    <h2 className='font-semibold'>Name</h2>
                    <h2 className='font-semibold'>Amount</h2>
                    <h2 className='font-semibold'>Date</h2>
                    <h2 className='font-semibold'>Actions</h2>
                </div>
                

       {expensesList.map((expenses,index)=>(
        <div key={index} className='grid grid-cols-4 items-center p-4 hover:bg-gray-50 transition-colors '>
            <h2  className='font-medium text-gray-800'>{expenses.name}</h2>
            <h2 className='font-bold text-green-600'>₹{expenses.amount}</h2>
            <h2  className='text-gray-600 font-medium'>{expenses.createdAt}</h2>
            <h2>
            <Trash className='text-red-600 cursor-pointer'
            onClick={()=>deleteExpense(expenses)}
            />
            </h2>
        </div> 
       ))}

    </div>
  )
}

export default ExpenseListTable