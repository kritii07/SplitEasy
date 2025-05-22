"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreateGroup from "./_components/CreateGroup";
import { toast } from "sonner";
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function GroupBills() {
  const [groups, setGroups] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

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

  useEffect(() => {
    fetchGroups();
  }, [searchParams]);

  const handleGroupCreated = (groupId) => {
    toast.success("Group created successfully!");
    router.push(`/dashboard/groupbills/${groupId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6 md:p-10">
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-20 -z-10" />
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full blur-[100px] opacity-20 -z-10" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Group Bills
            </h2>
            <p className="text-gray-600 mt-2">
              Collaborate and split expenses with friends and family
            </p>
          </div>
          <button
            onClick={() => setShowCreateGroup(true)}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            + New Group
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/80 rounded-xl p-6 h-40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Create New Group Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateGroup(true)}
              className="bg-white/90 backdrop-blur-sm border-2 border-dashed border-indigo-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all h-full min-h-[200px]"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl text-indigo-600">+</span>
              </div>
              <h3 className="text-lg font-medium text-indigo-700">Create New Group</h3>
              <p className="text-sm text-gray-500 mt-1 text-center">
                Start splitting bills with friends
              </p>
            </motion.div>

            {/* Group Cards */}
            {groups.map((group) => (
              <motion.div
                key={group.id}
                whileHover={{ y: -5 }}
                onClick={() => router.push(`/dashboard/groupbills/${group.id}`)}
                className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-blue-500" />
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{group.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {group.participantCount || 0} members
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Image
                        src="/group-icon.svg"
                        alt="Group"
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      Created: {new Date(group.createdAt).toLocaleDateString()}
                    </span>
                    <button className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">
                      View
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && groups.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Image
              src="/empty-groups.svg"
              alt="No groups"
              width={200}
              height={200}
              className="mx-auto mb-4"
            />
            <h3 className="text-lg font-medium text-gray-700">No groups yet</h3>
            <p className="text-gray-500 mb-6">Create your first group to start splitting expenses</p>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2 rounded-lg shadow hover:shadow-md transition-all"
            >
              Create Group
            </button>
          </motion.div>
        )}

        {/* Create Group Modal */}
        {showCreateGroup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4"
            >
              <CreateGroup
                onGroupCreated={handleGroupCreated}
                onCancel={() => setShowCreateGroup(false)}
              />
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}