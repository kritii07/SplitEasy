"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AddTransaction from "../_components/AddTransaction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function GroupDetails() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [splits, setSplits] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loadingSplits, setLoadingSplits] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  
  const fetchSettlements = async () => {
    const res = await fetch(`/api/groupbills/get-settlements?groupId=${id}`);
    const data = await res.json();
    setSettlements(data);
  };

  // const handleSettle = async (split) => {
  //   try {
  //     const res = await fetch('/api/groupbills/settle-amount', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         groupId: id,
  //         payerId: split.payerId,
  //         receiverId: split.receiverId,
  //         amount: split.amount
  //       }),
  //     });
  
  //     const data = await res.json();
      
  //     if (!res.ok) throw new Error(data.error || 'Failed to settle');
      
  //     toast.success('Amount settled successfully');
      
  //     // Update UI state immediately
  //     setSplits(prev => prev.filter(s => 
  //       !(s.payerId === split.payerId && 
  //         s.receiverId === split.receiverId)
  //     ));
      
  //     setSettlements(prev => [data.settlement, ...prev]);
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  const handleDeleteGroup = async () => {
    if (!confirm("Permanently delete this group and all its data?")) return;
  
    setIsDeleting(true);
    try {
      const res = await fetch("/api/groupbills/delete-group", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: id }),
      });
  
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.details || data.error || "Deletion failed");
      }
  
      toast.success("Group deleted successfully");
      window.location.href = "/dashboard/groupbills";

    } catch (error) {
      console.error("Deletion Error:", error);
      toast.error(`Deletion failed: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchGroupDetails = async () => {
    try {
      const res = await fetch(`/api/groupbills/get-group?id=${id}`);
      const data = await res.json();
      if (!data.error) setGroup(data);
    } catch (error) {
      console.error("Error fetching group details:", error);
      toast.error("Failed to load group details");
    }
  };

  const fetchParticipants = async () => {
    try {
      const res = await fetch(`/api/groupbills/get-participants?groupId=${id}`);
      const data = await res.json();
      if (!data.error) setParticipants(data);
    } catch (error) {
      console.error("Error fetching participants:", error);
      toast.error("Failed to load participants");
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`/api/groupbills/get-transactions?groupId=${id}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (res.ok) {
        setTransactions(data);
      } else {
        toast.error("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    }
  };

  const fetchSplits = async () => {
    if (isRefreshing) return;
    setLoadingSplits(true);
    
    try {
      // Add cache-busting parameter
      const res = await fetch(`/api/groupbills/get-splits?groupId=${id}&t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch splits");
  
      setSplits(data);
    } catch (error) {
      console.error("Error fetching splits:", error);
      toast.error(error.message || "Failed to load balances");
    } finally {
      setLoadingSplits(false);
    }
  };

  const refreshAllData = async () => {
    try {
      setIsRefreshing(true);
      setSplits([]); 
      
      await fetchTransactions();
      await fetchSplits(); 
      
      toast.success("Data refreshed");
    } catch (error) {
      console.error("Refresh failed:", error);
      toast.error("Refresh failed");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (id) {
      const loadInitialData = async () => {
        setLoading(true);
        try {
          await Promise.all([
            fetchGroupDetails(),
            fetchParticipants(),
            fetchTransactions(),
            fetchSplits(),
            fetchSettlements()
          ]);
        } finally {
          setLoading(false);
        }
      };
      loadInitialData();
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchSplits();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) return (
    <div className="p-10 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );

  if (!group) return (
    <div className="p-10">
      <p className="text-red-500">Group not found.</p>
    </div>
  );

  return (
    <div className="p-10">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-bold text-3xl">{group.name}</h2>
          <p className="text-gray-500 mt-2">Members: {participants.length}</p>
        </div>
        <button
          onClick={refreshAllData}
          className="flex items-center gap-2 text-sm px-3 py-1.5 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                ></path>
              </svg>
              Refreshing...
            </>
          ) : (
            <>🔄 Refresh All</>
          )}
        </button>

        <button
          onClick={handleDeleteGroup}
          disabled={isDeleting}
          className={`flex items-center gap-2 text-sm px-3 py-1.5 border rounded-md ${isDeleting ? 'bg-gray-100' : 'bg-red-100 hover:bg-red-200'} text-red-600`}
        >
          {isDeleting ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Deleting...
            </>
          ) : (
            <>
              🗑️ Delete Group
            </>
          )}
        </button>

      </div>

      <div className="mt-5 border p-5 rounded-lg">
        <h3 className="font-bold text-lg">Group Members</h3>
        <ul className="mt-2">
          {participants.length > 0 ? (
            participants.map((member) => (
              <li key={member.id} className="p-2 border-b">
                {member.name}
              </li>
            ))
          ) : (
            <p>No members found.</p>
          )}
        </ul>
      </div>

      <div className="mt-5 border p-5 rounded-lg">
        <h3 className="font-bold text-lg">Transactions</h3>
        {transactions.length > 0 ? (
          <ul className="mt-2 max-h-60 overflow-y-auto">
            {transactions.map((transaction) => (
              <li key={transaction.id} className="p-2 border-b">
                <strong>{transaction.payerName || "Unknown"}</strong> paid ₹{transaction.amount}
                <span className="text-gray-500"> ({transaction.description})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions found.</p>
        )}
      </div>

      <AddTransaction
        groupId={id}
        participants={participants}
        refreshData={refreshAllData} 
      />

      <div className="mt-5 border p-5 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Who Owes Whom</h3>
          <button
            onClick={fetchSplits}
            className="flex items-center gap-2 text-sm px-3 py-1.5 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            disabled={loadingSplits}
          >
            {loadingSplits ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                  ></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>🔄 Refresh Balances</>
            )}
          </button>
        </div>

        {splits.error ? (
          <div className="text-red-500 p-2 bg-red-50 rounded">
            Error loading balances.{" "}
            <button 
              onClick={fetchSplits}
              className="text-blue-500 hover:underline"
            >
              Retry
            </button>
          </div>
        ) : splits.length > 0 ? (
          <ul className="mt-2">
            {splits.map((split, index) => (
              <li key={`${split.payer}-${split.receiver}-${index}`} className="p-2 border-b flex justify-between gap-10">
                <div>
                <strong>{split.payer}</strong> owes ₹{split.amount} to{" "}
                <strong>{split.receiver}</strong>
                </div>
                {/* <Button
                  size="sm"
                  onClick={() => handleSettle(split)}
                  className="ml-4"
                >
                  Settle
                </Button> */}
              </li>
            ))}
             
          </ul>
        ) : (
          <p>No balances found.</p>
        )}
      </div>

       {/* <div className="mt-5 border p-5 rounded-lg">
      <h3 className="font-bold text-lg">Settlement History</h3>
      {settlements.length > 0 ? (
        <ul className="mt-2">
          {settlements.map((settle) => (
            <li key={settle.id} className="p-2 border-b">
              <span className="font-medium">{settle.payerName}</span> paid ₹{settle.amount} to <span className="font-medium">{settle.receiverName}</span>
              <span className="text-gray-500 text-sm ml-2">
                {new Date(settle.settledAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No settlements yet</p>
      )}
    </div> */}
      
    </div>
  );
}