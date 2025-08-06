import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Copy, ArrowUpRight, Users, Calendar, Trash2 } from "lucide-react";
import { CopyCheck } from "lucide-react";
import { ResponseService } from "@/services/responses.service";
import { InterviewService } from "@/services/interviews.service";
import axios from "axios";
import MiniLoader from "@/components/loaders/mini-loader/miniLoader";
import { InterviewerService } from "@/services/interviewers.service";
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
import { useInterviews } from "@/contexts/interviews.context";

interface Props {
  name: string | null;
  interviewerId: bigint;
  id: string;
  url: string;
  readableSlug: string;
}

const base_url = process.env.NEXT_PUBLIC_LIVE_URL;

function InterviewCard({ name, interviewerId, id, url, readableSlug }: Props) {
  const [copied, setCopied] = useState(false);
  const [responseCount, setResponseCount] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [img, setImg] = useState("");
  const [lastResponseDate, setLastResponseDate] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { fetchInterviews } = useInterviews();

  useEffect(() => {
    const fetchInterviewer = async () => {
      const interviewer = await InterviewerService.getInterviewer(interviewerId);
      setImg(interviewer.image);
    };
    fetchInterviewer();
  }, [interviewerId]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const responses = await ResponseService.getAllResponses(id);
        setResponseCount(responses.length);
        
        if (responses.length > 0) {
          setIsFetching(true);
          for (const response of responses) {
            if (!response.is_analysed) {
              try {
                const result = await axios.post("/api/get-call", {
                  id: response.call_id,
                });

                if (result.status !== 200) {
                  throw new Error(`HTTP error! status: ${result.status}`);
                }
              } catch (error) {
                console.error(
                  `Failed to call api/get-call for response id ${response.call_id}:`,
                  error,
                );
              }
            }
          }
          setIsFetching(false);
          
          // Get the most recent response date
          const sortedResponses = responses.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          if (sortedResponses[0]) {
            setLastResponseDate(new Date(sortedResponses[0].created_at).toLocaleDateString());
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchResponses();
  }, [id]);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(
        readableSlug ? `${base_url}/call/${readableSlug}` : (url as string),
      )
      .then(
        () => {
          setCopied(true);
          toast.success(
            "The link to your interview has been copied to your clipboard.",
            {
              position: "bottom-right",
              duration: 3000,
            },
          );
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        },
        (err) => {
          console.log("failed to copy", err.message);
        },
      );
  };

  const handleJumpToInterview = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const interviewUrl = readableSlug
      ? `/call/${readableSlug}`
      : `/call/${url}`;
    window.open(interviewUrl, "_blank");
  };

  const handleDeleteInterview = async () => {
    setIsDeleting(true);
    try {
      await InterviewService.deleteInterview(id);
      toast.success("Interview deleted successfully.", {
        position: "bottom-right",
        duration: 3000,
      });
      fetchInterviews(); // Refresh the interviews list
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Failed to delete the interview.", {
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className={`relative h-80 w-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
      isFetching || isDeleting ? "opacity-60" : ""
    }`}>
      <CardContent className="p-0 h-full">
        {/* Header with gradient background */}
        <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-4 left-4 right-4">
            <CardTitle className="text-white text-xl font-bold leading-tight">
              {name}
            </CardTitle>
            {(isFetching || isDeleting) && (
              <div className="mt-2">
                <MiniLoader />
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-0 h-8 w-8 p-0"
              onClick={handleJumpToInterview}
            >
              <ArrowUpRight size={16} />
            </Button>
            <Button
              size="sm"
              className={`bg-white/20 hover:bg-white/30 text-white border-0 h-8 w-8 p-0 ${
                copied ? "bg-green-500/80" : ""
              }`}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                copyToClipboard();
              }}
            >
              {copied ? <CopyCheck size={16} /> : <Copy size={16} />}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-red-500/20 hover:bg-red-500/40 text-white border-0 h-8 w-8 p-0"
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Interview</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{name}"? This action cannot be undone and will permanently remove all associated responses.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600"
                    onClick={handleDeleteInterview}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Content section */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <Image
                src={img}
                alt="Interviewer"
                width={60}
                height={60}
                className="rounded-full object-cover border-2 border-gray-200"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">AI Interviewer</h3>
              <p className="text-sm text-gray-500">Ready to interview</p>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Users size={16} />
                <span className="text-sm font-medium">Responses</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {responseCount?.toString() || 0}
              </span>
            </div>
            
            {lastResponseDate && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">Last Response</span>
                </div>
                <span className="text-sm text-gray-500">
                  {lastResponseDate}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default InterviewCard;
