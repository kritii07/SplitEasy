"use client"
import React, { useEffect, useState } from 'react'
import ExpenseListTable from './_components/ExpenseListTable';
import { useUser } from '@clerk/nextjs';
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import { db } from "@/utils/dbConfig";

function page() {
    const { user } = useUser();
    const [budgetList, setBudgetList] = useState([]);
    const [expensesList, setEpensesList] = useState([]);

    useEffect(() => {
        user && getBudgetList();
    }, [user]);

    const getBudgetList = async () => {
        const result = await db
            .select({
                ...getTableColumns(Budgets),
                totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
                totalItem: sql`count(${Expenses.id})`.mapWith(Number),
            })
            .from(Budgets)
            .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
            .groupBy(Budgets.id)
            .orderBy(desc(Budgets.id));

        setBudgetList(result);
        getAllExpenses();
    };

    const getAllExpenses = async () => {
        const result = await db.select({
            id: Expenses.id,
            name: Expenses.name,
            amount: Expenses.amount,
            createdAt: Expenses.createdAt
        }).from(Budgets)
        .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
        .orderBy(desc(Expenses.id));
    
        setEpensesList(result);
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8'>
            <div className='bg-white rounded-xl shadow-sm p-6'>
                <h1 className='text-2xl font-bold text-gray-800 mb-6'>Expense Dashboard</h1>
                <ExpenseListTable
                    expensesList={expensesList}
                    refreshData={() => getBudgetList()}
                />
            </div>
        </div>
    )
}

export default page