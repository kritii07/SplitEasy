"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreateGroup from "./_components/CreateGroup";
import { toast } from "sonner";


export default function GroupBills() {
  const [groups, setGroups] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch groups with proper cache busting
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/groupbills/get-groups?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!res.ok) throw new Error("Failed to fetch groups");
      
      const data = await res.json();
      setGroups(data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when search params change
  useEffect(() => {
    fetchGroups();
  }, [searchParams]);

  // Handle group creation with forced refresh
  const handleGroupCreated = (groupId) => {
    toast.success("Group created");
    router.push(`/dashboard/groupbills?refresh=${Date.now()}`);
    router.refresh();
  };

  // Handle group selection
  const handleSelectGroup = (groupId) => {
    router.push(`/dashboard/groupbills/${groupId}`);
  };

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">Group Bills</h2>

      {loading ? (
        <div className="flex justify-center mt-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-7">
            {/* Create New Group Box */}
            <div
              className="bg-gray-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md"
              onClick={() => setShowCreateGroup(true)}
            >
              <h2 className="text-3xl">+</h2>
              <h2>Create New Group</h2>
            </div>

            {/* Groups list */}
            {groups.map((group) => (
              <div
                key={group.id}
                className="p-5 border rounded-lg hover:shadow-md cursor-pointer"
                onClick={() => handleSelectGroup(group.id)}
              >
                <h2 className="font-bold text-lg">{group.name}</h2>
                <p className="text-sm text-gray-500">
                  {group.participantCount || 0} Members
                </p>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {groups.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No groups found</p>
            </div>
          )}

          {/* Create Group Modal */}
          {showCreateGroup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white p-5 rounded-lg max-w-md w-full">
              <CreateGroup
                onGroupCreated={(groupId) => {
                  // This will automatically close the modal
                  setShowCreateGroup(false);
                  router.push(`/dashboard/groupbills?refresh=${Date.now()}`);
                }}
                onCancel={() => setShowCreateGroup(false)}
              />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}