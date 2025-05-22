"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function AddTransaction({ groupId, participants, refreshData }) {
  const [payerId, setPayerId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize with all participant IDs (excluding payer when set)
  useEffect(() => {
    setSelectedParticipants(
      participants.filter(p => p.id !== payerId).map(p => p.id)
    );
  }, [participants, payerId]);

  const handleAddTransaction = async () => {
    if (!payerId || !amount || Number(amount) <= 0) {
      toast.error("Please enter valid details!");
      return;
    }

    // Validate at least one participant is selected for custom split
    if (splitType === "custom" && selectedParticipants.length === 0) {
      toast.error("Please select at least one participant!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/groupbills/add-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          payerId,
          amount: Number(amount).toFixed(2), // Ensure proper decimal format
          description,
          splitType,
          selectedParticipants: splitType === "equal" 
            ? participants.filter(p => p.id !== payerId).map(p => p.id) 
            : selectedParticipants,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to add transaction");

      toast.success("Transaction Added Successfully!");
      
      // Reset form
      setAmount("");
      setDescription("");
      
      // Refresh parent data with error handling
      try {
        await refreshData();
      } catch (refreshError) {
        console.error("Refresh failed:", refreshError);
        toast.warning("Transaction added but refresh failed");
      }
      
    } catch (error) {
      console.error("Transaction Error:", error);
      toast.error(error.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-5 rounded-lg">
      <h2 className="font-bold text-lg">Add Expense</h2>

      {/* Payer Selection */}
      <div className="mt-3">
        <label className="block font-medium">Who Paid?</label>
        <select
          className="w-full border p-2 rounded-md mt-1"
          value={payerId}
          onChange={(e) => {
            setPayerId(e.target.value);
            // Auto-exclude payer from participants
            if (splitType === "custom") {
              setSelectedParticipants(
                participants
                  .filter(p => p.id !== e.target.value)
                  .map(p => p.id)
              );
            }
          }}
          disabled={loading}
        >
          <option value="">Select Payer</option>
          {participants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Amount Input */}
      <div className="mt-3">
        <label className="block font-medium">Amount</label>
        <Input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          disabled={loading}
        />
      </div>

      {/* Description Input */}
      <div className="mt-3">
        <label className="block font-medium">Description</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What was this for?"
          disabled={loading}
        />
      </div>

      {/* Split Type Toggle */}
      <div className="mt-3">
        <label className="block font-medium">Split Method</label>
        <div className="flex gap-3">
          <Button
            variant={splitType === "equal" ? "default" : "outline"}
            onClick={() => setSplitType("equal")}
            disabled={loading}
          >
            Equal Split
          </Button>
          <Button
            variant={splitType === "custom" ? "default" : "outline"}
            onClick={() => setSplitType("custom")}
            disabled={loading}
          >
            Custom Split
          </Button>
        </div>
      </div>

      {/* Participant Selection */}
      {splitType === "custom" && (
        <div className="mt-3 space-y-2">
          <label className="block font-medium">Split Between:</label>
          {participants
            .filter(p => p.id !== payerId) // Exclude payer
            .map((p) => (
              <label key={p.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedParticipants.includes(p.id)}
                  onChange={() => {
                    setSelectedParticipants(prev =>
                      prev.includes(p.id)
                        ? prev.filter(id => id !== p.id)
                        : [...prev, p.id]
                    );
                  }}
                  disabled={loading}
                />
                {p.name}
              </label>
            ))}
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleAddTransaction}
        className="mt-4 w-full"
        disabled={loading || !payerId || !amount}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">↻</span>
            Processing...
          </span>
        ) : (
          "Add Expense"
        )}
      </Button>
    </div>
  );
}

export default AddTransaction;