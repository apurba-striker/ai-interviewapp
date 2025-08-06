"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  Copy, 
  Trash2, 
  CopyCheck,
  Users 
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface InterviewerCardProps {
  interviewer: {
    id: string;
    name: string;
    description: string;
    image: string;
    personality: string;
    specialties: string[];
    is_active: boolean;
    created_at: string;
  };
  onDelete?: (id: string) => void;
}

export default function InterviewerCard({ interviewer, onDelete }: InterviewerCardProps) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(interviewer.name).then(
      () => {
        setCopied(true);
        toast.success("Interviewer name copied to clipboard!", {
          position: "bottom-right",
          duration: 3000,
        });
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.log("Failed to copy", err.message);
        toast.error("Failed to copy to clipboard", {
          position: "bottom-right",
          duration: 3000,
        });
      }
    );
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    setShowDeleteDialog(false);
    
    try {
      await onDelete(interviewer.id);
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
    } finally {
      setIsDeleting(false);
    }
  };

  const handleJumpToInterviewer = () => {
    // Navigate to interviewer details or edit page
    window.open(`/dashboard/interviewers/${interviewer.id}`, "_blank");
  };

  return (
    <>
      <Card className="relative h-80 w-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-gray-200 dark:border-gray-700">
        <CardContent className="p-0 h-full">
          {/* Header with gradient background */}
          <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-4 left-4 right-4">
              <h3 className="text-white text-xl font-bold leading-tight">
                {interviewer.name}
              </h3>
              {isDeleting && (
                <div className="mt-2 text-white text-sm">Deleting...</div>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-0 h-8 w-8 p-0"
                onClick={handleJumpToInterviewer}
              >
                <ArrowUpRight size={16} />
              </Button>
              <Button
                size="sm"
                className={`bg-white/20 hover:bg-white/30 text-white border-0 h-8 w-8 p-0 ${
                  copied ? "bg-green-500/80" : ""
                }`}
                onClick={copyToClipboard}
              >
                {copied ? <CopyCheck size={16} /> : <Copy size={16} />}
              </Button>
              <Button
                size="sm"
                className="bg-red-500/20 hover:bg-red-500/40 text-white border-0 h-8 w-8 p-0"
                onClick={handleDeleteClick}
                disabled={isDeleting}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>

          {/* Content section */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <Image
                  src={interviewer.image || "/api/placeholder/150/150"}
                  alt={interviewer.name}
                  width={60}
                  height={60}
                  className="rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  interviewer.is_active ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Interviewer</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {interviewer.is_active ? "Ready to interview" : "Inactive"}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Users size={16} />
                  <span className="text-sm font-medium">Responses</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  0
                </span>
              </div>
              
              {/* Personality */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Personality:</span> {interviewer.personality}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">
              Delete Interviewer
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete "{interviewer.name}"? This action cannot be undone and will permanently remove this AI interviewer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
