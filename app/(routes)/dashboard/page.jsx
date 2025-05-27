"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import CardInfo from "./_components/CardInfo";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import { db } from "@/utils/dbConfig";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

function Dashboard() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user]);

  const getBudgetList = async () => {
    setLoading(true);
    try {
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
      await getAllExpenses();
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllExpenses = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));

    setExpensesList(result);
  };

  return (
    <div className="p-10 pl-8 md:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {user?.fullName}!
            </h2>
            <p className="text-gray-600 mt-2">
              Here's your financial overview. Let's manage your expenses effectively.
            </p>
          </div>
          <UserButton appearance={{
            elements: {
              avatarBox: "h-10 w-10 border-2 border-indigo-100 shadow-sm"
            }
          }} />
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <CardInfo budgetList={budgetList} loading={loading} />
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-8 gap-6">
        {/* Left Column - Chart and Expenses */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Spending Overview</h3>
            {loading ? (
              <Skeleton className="h-64 w-full rounded-lg" />
            ) : (
              <BarChartDashboard budgetList={budgetList} />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-gray-800">Recent Transactions</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">
                View All
              </button>
            </div>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <ExpenseListTable
                expensesList={expensesList}
                refreshData={getBudgetList}
              />
            )}
          </motion.div>
        </div>

        {/* Right Column - Budgets */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Your Budgets</h3>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            ) : budgetList.length > 0 ? (
              <div className="space-y-4">
                {budgetList.map((budget, index) => (
                  <BudgetItem 
                    budget={budget} 
                    key={index} 
                    className="hover:shadow-md transition-shadow"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No budgets created yet</p>
                <button className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Create your first budget
                </button>
              </div>
            )}
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white rounded-lg p-3 shadow-xs border hover:shadow-md transition-all flex flex-col items-center">
                <span className="text-indigo-600 mb-1">➕</span>
                <span className="text-sm font-medium">New Budget</span>
                
              </button>
              <button className="bg-white rounded-lg p-3 shadow-xs border hover:shadow-md transition-all flex flex-col items-center">
                <span className="text-indigo-600 mb-1">💸</span>
                <span className="text-sm font-medium">Add Expense</span>
              </button>
              <button className="bg-white rounded-lg p-3 shadow-xs border hover:shadow-md transition-all flex flex-col items-center">
                <span className="text-indigo-600 mb-1">📊</span>
                <span className="text-sm font-medium">Reports</span>
              </button>
              <button className="bg-white rounded-lg p-3 shadow-xs border hover:shadow-md transition-all flex flex-col items-center">
                <span className="text-indigo-600 mb-1">⚙️</span>
                <span className="text-sm font-medium">Settings</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;