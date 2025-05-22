"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function CreateGroup({ onGroupCreated, onCancel }) {
  const [groupName, setGroupName] = useState("");
  const [participants, setParticipants] = useState([{ name: "", email: "" }]);
  const [loading, setLoading] = useState(false);

  // Check if form is valid
  const isFormValid = () => {
    return (
      groupName.trim() && 
      participants.every(p => p.name.trim()) &&
      !loading
    );
  };

  // Add more participants
  const addParticipant = () => {
    setParticipants([...participants, { name: "", email: "" }]);
  };

  // Update participant details
  const updateParticipant = (index, field, value) => {
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    setParticipants(newParticipants);
  };

  // Submit group creation request
  const handleCreateGroup = async () => {
    if (!isFormValid()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/groupbills/create-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: groupName, 
          createdBy: "user@example.com" // Replace with actual user
        }),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to create group");

      // Add participants if group was created
      if (data.success) {
        const addParticipantsRes = await fetch("/api/groupbills/add-participants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            groupId: data.groupId,
            participants: participants.filter(p => p.name.trim())
          }),
        });

        if (!addParticipantsRes.ok) {
          throw new Error("Failed to add participants");
        }
      }

      toast.success("Group Created Successfully!");
      onGroupCreated(data.groupId);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">Create a Group</h2>

      <Input
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        disabled={loading}
      />

      <h3 className="font-medium pt-2">Participants</h3>
      <div className="max-h-60 overflow-y-auto space-y-2">
        {participants.map((participant, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Name"
              value={participant.name}
              onChange={(e) => updateParticipant(index, "name", e.target.value)}
              disabled={loading}
            />
            <Input
              placeholder="Email (Optional)"
              value={participant.email}
              onChange={(e) => updateParticipant(index, "email", e.target.value)}
              disabled={loading}
            />
          </div>
        ))}
      </div>

      <Button 
        onClick={addParticipant} 
        variant="outline" 
        className="w-full"
        disabled={loading}
      >
        + Add Participant
      </Button>

      <div className="flex gap-2 pt-4">
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateGroup}
          className="flex-1"
          disabled={!isFormValid()}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              Creating...
            </span>
          ) : (
            "Create Group"
          )}
        </Button>
      </div>
    </div>
  );
}

export default CreateGroup;