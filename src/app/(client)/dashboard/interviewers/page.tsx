"use client";

import React, { useState, useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Plus, 
  Settings as SettingsIcon,
  Mic,
  UserCheck,
  Star
} from "lucide-react";
import { toast } from "sonner";
import InterviewerCard from "@/components/dashboard/interviewer/interviewerCard";

interface Interviewer {
  id: string;
  name: string;
  description: string;
  image: string;
  personality: string;
  specialties: string[];
  is_active: boolean;
  created_at: string;
}

export default function Interviewers() {
  const { organization } = useOrganization();
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockInterviewers: Interviewer[] = [
    {
      id: "1",
      name: "hello",
      description: "Curious and detail-oriented interviewer who digs deep into experiences",
      image: "/api/placeholder/150/150",
      personality: "Curious, Analytical, Detail-oriented",
      specialties: ["Technical Interviews", "Behavioral Questions", "Problem Solving"],
      is_active: true,
      created_at: "2024-01-15"
    },
    {
      id: "2", 
      name: "apurba",
      description: "Warm and supportive interviewer who creates a comfortable environment",
      image: "/api/placeholder/150/150",
      personality: "Supportive, Understanding, Patient",
      specialties: ["Cultural Fit", "Soft Skills", "Team Dynamics"],
      is_active: true,
      created_at: "2024-01-20"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInterviewers(mockInterviewers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateInterviewer = () => {
    toast.info("Create interviewer functionality coming soon!", {
      position: "bottom-right",
      duration: 3000,
    });
  };

  const handleDeleteInterviewer = async (id: string) => {
    try {
      // Here you would call your API to delete the interviewer
      // For now, we'll just remove it from the local state
      setInterviewers(prev => prev.filter(interviewer => interviewer.id !== id));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success("Interviewer deleted successfully!", {
        position: "bottom-right",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error deleting interviewer:", error);
      toast.error("Failed to delete interviewer", {
        position: "bottom-right",
        duration: 3000,
      });
      throw error; // Re-throw to let the card component handle the error state
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Interviewers</h1>
            <p className="text-gray-600 dark:text-gray-400">Configure and manage your AI interviewers</p>
          </div>
        </div>
        <Button 
          onClick={handleCreateInterviewer}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Interviewer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Interviewers</p>
                <p className="text-2xl font-bold">{interviewers.length}</p>
              </div>
              <Users className="h-6 w-6 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Interviewers</p>
                <p className="text-2xl font-bold">{interviewers.filter(i => i.is_active).length}</p>
              </div>
              <UserCheck className="h-6 w-6 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Interviews</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Mic className="h-6 w-6 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interviewers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviewers.map((interviewer) => (
          <InterviewerCard
            key={interviewer.id}
            interviewer={interviewer}
            onDelete={handleDeleteInterviewer}
          />
        ))}
      </div>

      {/* Empty State */}
      {interviewers.length === 0 && (
        <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Interviewers Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first AI interviewer to start conducting intelligent interviews.
            </p>
            <Button 
              onClick={handleCreateInterviewer}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Interviewer
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
