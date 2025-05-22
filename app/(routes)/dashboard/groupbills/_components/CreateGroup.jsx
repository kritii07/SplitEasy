"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, X, Loader2, Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

function CreateGroup({ onGroupCreated, onCancel }) {
  const [groupName, setGroupName] = useState("");
  const [participants, setParticipants] = useState([{ name: "", email: "" }]);
  const [loading, setLoading] = useState(false);

  const isFormValid = () => {
    return (
      groupName.trim() && 
      participants.every(p => p.name.trim()) &&
      !loading
    );
  };

  const addParticipant = () => {
    setParticipants([...participants, { name: "", email: "" }]);
  };

  const removeParticipant = (index) => {
    if (participants.length <= 1) return;
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
  };

  const updateParticipant = (index, field, value) => {
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    setParticipants(newParticipants);
  };

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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          Create New Group
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="group-name">Group Name</Label>
          <Input
            id="group-name"
            placeholder="e.g., Roommates, Family Trip, Office Team"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Participants</Label>
            <span className="text-sm text-muted-foreground">
              {participants.length} member{participants.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {participants.map((participant, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="flex-1 space-y-1">
                  <Input
                    placeholder="Full Name"
                    value={participant.name}
                    onChange={(e) => updateParticipant(index, "name", e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Input
                    placeholder="Email (Optional)"
                    value={participant.email}
                    onChange={(e) => updateParticipant(index, "email", e.target.value)}
                    disabled={loading}
                  />
                </div>
                {participants.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeParticipant(index)}
                    disabled={loading}
                    className="h-9 w-9"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button 
            onClick={addParticipant} 
            variant="outline" 
            className="w-full gap-2"
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
            Add Participant
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3">
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
          className="flex-1 gap-2"
          disabled={!isFormValid()}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Group"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CreateGroup;