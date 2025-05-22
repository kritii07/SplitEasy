import { PiggyBank, ReceiptText, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function CardInfo({ budgetList }) {
  const [totalBudget, setTotalBudget] = useState(0)
  const [totalSpend, setTotalSpend] = useState(0)

  useEffect(() => {
    budgetList && CalculateCardInfo()
  }, [budgetList])

  const CalculateCardInfo = () => {
    let totalBudget_ = 0
    let totalSpend_ = 0

    budgetList.forEach((element) => {
      totalBudget_ = totalBudget_ + Number(element.amount)
      totalSpend_ = totalSpend_ + element.totalSpend
    })

    setTotalBudget(totalBudget_)
    setTotalSpend(totalSpend_)
  }

  return (
    <div>
      {budgetList ? (
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Budget */}
          <div
            className="relative p-7 rounded-2xl text-white shadow-lg overflow-hidden"
            style={{
              backgroundImage: `url('/images/budget-bg.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-600 opacity-80 rounded-2xl z-0"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold opacity-90">Total Budget</h2>
                <h2 className="font-extrabold text-3xl mt-1">₹{totalBudget}</h2>
              </div>
              <PiggyBank className="h-12 w-12 p-2 bg-white bg-opacity-10 rounded-full text-white shadow-md" />
            </div>
          </div>

          {/* Total Spend */}
          <div
            className="relative p-7 rounded-2xl text-white shadow-lg overflow-hidden"
            style={{
              backgroundImage: `url('/images/spend-bg.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500 to-pink-600 opacity-80 rounded-2xl z-0"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold opacity-90">Total Spend</h2>
                <h2 className="font-extrabold text-3xl mt-1">₹{totalSpend}</h2>
              </div>
              <ReceiptText className="h-12 w-12 p-2 bg-white bg-opacity-10 rounded-full text-white shadow-md" />
            </div>
          </div>

          {/* No. of Budgets */}
          <div
            className="relative p-7 rounded-2xl text-white shadow-lg overflow-hidden"
            style={{
              backgroundImage: `url('/images/wallet-bg.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-600 opacity-80 rounded-2xl z-0"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold opacity-90">No. of Budgets</h2>
                <h2 className="font-extrabold text-3xl mt-1">{budgetList?.length}</h2>
              </div>
              <Wallet className="h-12 w-12 p-2 bg-white bg-opacity-10 rounded-full text-white shadow-md" />
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default CardInfo
