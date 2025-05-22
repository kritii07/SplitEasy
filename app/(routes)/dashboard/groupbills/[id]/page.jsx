"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AddTransaction from "../_components/AddTransaction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2, User, ArrowRight, History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (!group) return (
    <div className="p-6">
      <p className="text-red-500">Group not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">{group.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <User className="h-5 w-5 text-purple-600" />
            <span className="text-lg text-purple-700">
              {participants.length} member{participants.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            className="bg-white hover:bg-purple-100 text-purple-700 border-purple-300"
            size="sm"
            onClick={refreshAllData}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteGroup}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete Group
          </Button>
        </div>
      </div>

      {/* Members and Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Members Box */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Group Members</h2>
            <span className="text-sm px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
              {participants.length}
            </span>
          </div>
          <div className="space-y-4">
            {participants.length > 0 ? (
              participants.map((member) => (
                <div key={member.id} className="flex items-center gap-4 p-3 hover:bg-purple-50 rounded-lg transition-colors">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{member.name}</p>
                    <p className="text-sm text-gray-500">
                      {member.email}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No members found</p>
            )}
          </div>
        </div>

        {/* Transactions Box */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Transactions</h2>
            <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              {transactions.length}
            </span>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex justify-between items-center p-3 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">{transaction.description || "No description"}</p>
                    <p className="text-xs text-gray-500">
                      Paid by {transaction.payerName}
                    </p>
                  </div>
                  <span className="font-bold text-blue-600">₹{transaction.amount}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No transactions yet</p>
            )}
          </div>
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline"
              className="bg-white hover:bg-blue-100 text-blue-600 border-blue-300"
              size="sm" 
              onClick={() => document.getElementById('add-transaction')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Add Transaction
            </Button>
          </div>
        </div>
      </div>

      {/* Add Transaction Component */}
      <div id="add-transaction">
        <AddTransaction
          groupId={id}
          participants={participants}
          refreshData={refreshAllData} 
        />
      </div>

      {/* Balances Box */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Balances</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-purple-600 hover:bg-purple-50"
            onClick={fetchSplits}
            disabled={loadingSplits}
          >
            {loadingSplits ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
        {splits.error ? (
          <div className="text-red-500 p-3 bg-red-50 rounded-lg">
            Error loading balances.{" "}
            <Button 
              variant="link"
              size="sm"
              onClick={fetchSplits}
              className="text-blue-600 hover:underline"
            >
              Retry
            </Button>
          </div>
        ) : splits.length > 0 ? (
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-4 font-semibold text-sm text-gray-500 pb-3 border-b">
              <div>From</div>
              <div></div>
              <div>To</div>
              <div className="text-right">Amount</div>
            </div>
            {splits.map((split, index) => (
              <div 
                key={`${split.payer}-${split.receiver}-${index}`} 
                className="grid grid-cols-4 gap-4 items-center py-3 border-b last:border-b-0 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <div className="font-medium text-gray-800">{split.payer}</div>
                <div>
                  <ArrowRight className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-gray-700">{split.receiver}</div>
                <div className="text-right font-bold text-purple-600">
                  ₹{split.amount}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No balances found</p>
        )}
      </div>

      {/* Settlement History Box */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <History className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Settlement History</h2>
        </div>
        {settlements.length > 0 ? (
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-4 font-semibold text-sm text-gray-500 pb-3 border-b">
              <div>From</div>
              <div></div>
              <div>To</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Date</div>
            </div>
            {settlements.map((settle) => (
              <div 
                key={settle.id} 
                className="grid grid-cols-5 gap-4 items-center py-3 border-b last:border-b-0 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <div className="font-medium text-gray-800">{settle.payerName}</div>
                <div>
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-gray-700">{settle.receiverName}</div>
                <div className="text-right font-bold text-blue-600">
                  ₹{settle.amount}
                </div>
                <div className="text-right text-gray-500 text-sm">
                  {new Date(settle.settledAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No settlements yet</p>
        )}
      </div>
    </div>
);

}