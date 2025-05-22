"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User, Wallet, ListChecks, Equal, Split } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

function AddTransaction({ groupId, participants, refreshData }) {
  const [payerId, setPayerId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

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
          amount: Number(amount).toFixed(2),
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
      setAmount("");
      setDescription("");
      
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Wallet className="h-6 w-6 text-purple-600" />
        Add New Expense
      </h2>

      {/* Payer Selection */}
      <div className="mt-5 space-y-2">
        <Label className="text-gray-700 flex items-center gap-2">
          <User className="h-4 w-4" />
          Who Paid?
        </Label>
        <Select
          value={payerId}
          onValueChange={(value) => {
            setPayerId(value);
            if (splitType === "custom") {
              setSelectedParticipants(
                participants
                  .filter(p => p.id !== value)
                  .map(p => p.id)
              );
            }
          }}
          disabled={loading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select payer" />
          </SelectTrigger>
          <SelectContent>
            {participants.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amount Input */}
      <div className="mt-4 space-y-2">
        <Label className="text-gray-700">Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
          <Input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            disabled={loading}
            className="pl-8"
          />
        </div>
      </div>

      {/* Description Input */}
      <div className="mt-4 space-y-2">
        <Label className="text-gray-700 flex items-center gap-2">
          <ListChecks className="h-4 w-4" />
          Description
        </Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Dinner, Groceries, Movie tickets..."
          disabled={loading}
        />
      </div>

      {/* Split Type Toggle */}
      <div className="mt-4 space-y-2">
        <Label className="text-gray-700">Split Method</Label>
        <div className="flex gap-2">
          <Button
            variant={splitType === "equal" ? "default" : "outline"}
            onClick={() => setSplitType("equal")}
            disabled={loading}
            className="flex-1 gap-2"
          >
            <Equal className="h-4 w-4" />
            Equal
          </Button>
          <Button
            variant={splitType === "custom" ? "default" : "outline"}
            onClick={() => setSplitType("custom")}
            disabled={loading}
            className="flex-1 gap-2"
          >
            <Split className="h-4 w-4" />
            Custom
          </Button>
        </div>
      </div>

      {/* Participant Selection */}
      {splitType === "custom" && (
        <div className="mt-4 space-y-3">
          <Label className="text-gray-700">Split Between:</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
            {participants
              .filter(p => p.id !== payerId)
              .map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`participant-${p.id}`}
                    checked={selectedParticipants.includes(p.id)}
                    onCheckedChange={(checked) => {
                      setSelectedParticipants(prev =>
                        checked
                          ? [...prev, p.id]
                          : prev.filter(id => id !== p.id)
                      );
                    }}
                    disabled={loading}
                  />
                  <Label htmlFor={`participant-${p.id}`} className="font-normal">
                    {p.name}
                  </Label>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleAddTransaction}
        className="mt-6 w-full h-12 text-lg"
        disabled={loading || !payerId || !amount}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">↻</span>
            Adding Expense...
          </span>
        ) : (
          "Add Expense"
        )}
      </Button>
    </div>
  );
}

export default AddTransaction;