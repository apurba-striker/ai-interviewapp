"use client";

import React, { useState, useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import InterviewCard from "@/components/dashboard/interview/interviewCard";
import CreateInterviewCard from "@/components/dashboard/interview/createInterviewCard";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { InterviewService } from "@/services/interviews.service";
import { ClientService } from "@/services/clients.service";
import { ResponseService } from "@/services/responses.service";
import { useInterviews } from "@/contexts/interviews.context";
import Modal from "@/components/dashboard/Modal";
import { Gem, Plus, TrendingUp, Users, Calendar } from "lucide-react";
import Image from "next/image";

function Interviews() {
  const { interviews, interviewsLoading } = useInterviews();
  const { organization } = useOrganization();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [allowedResponsesCount, setAllowedResponsesCount] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [totalResponses, setTotalResponses] = useState<number>(0);

  function InterviewsLoader() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-72 w-full animate-pulse">
            <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl h-full" />
          </div>
        ))}
      </div>
    );
  }

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        if (organization?.id) {
          const data = await ClientService.getOrganizationById(organization.id);
          if (data?.plan) {
            setCurrentPlan(data.plan);
            if (data.plan === "free_trial_over") {
              setIsModalOpen(true);
            }
          }
          if (data?.allowed_responses_count) {
            setAllowedResponsesCount(data.allowed_responses_count);
          }
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    };

    fetchOrganizationData();
  }, [organization]);

  useEffect(() => {
    const fetchResponsesCount = async () => {
      if (!organization || currentPlan !== "free") {
        return;
      }

      setLoading(true);
      try {
        const totalResponses = await ResponseService.getResponseCountByOrganizationId(
          organization.id,
        );
        setTotalResponses(totalResponses);
        const hasExceededLimit = totalResponses >= allowedResponsesCount;
        if (hasExceededLimit) {
          setCurrentPlan("free_trial_over");
          await InterviewService.deactivateInterviewsByOrgId(organization.id);
          await ClientService.updateOrganization(
            { plan: "free_trial_over" },
            organization.id,
          );
        }
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponsesCount();
  }, [organization, currentPlan, allowedResponsesCount]);

  return (
    <main className="p-4 lg:p-6 pt-4 ml-12 mr-auto max-w-6xl">
      {/* Header Section - Tighter spacing */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              My Interviews
            </h1>
            <p className="text-gray-600 text-base lg:text-lg">
              Start getting responses now!
            </p>
          </div>
          
          {/* Stats Cards - Better positioning */}
          <div className="flex gap-3 lg:gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 flex-1 lg:flex-none lg:w-40">
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="p-1.5 lg:p-2 bg-blue-100 rounded-lg">
                    <Users className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs lg:text-sm text-gray-600 mb-0.5">Total Responses</p>
                    <p className="text-lg lg:text-xl font-bold text-gray-900">{totalResponses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 flex-1 lg:flex-none lg:w-40">
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="p-1.5 lg:p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs lg:text-sm text-gray-600 mb-0.5">Active Interviews</p>
                    <p className="text-lg lg:text-xl font-bold text-gray-900">{interviews.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Interviews Grid - Tighter spacing */}
      <div className="space-y-4">
        {currentPlan === "free_trial_over" ? (
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-dashed border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 h-64 w-full max-w-sm">
            <CardContent className="flex items-center justify-center h-full p-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <Plus size={24} className="text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Upgrade Required
                </h3>
                <p className="text-sm text-gray-600 text-center max-w-xs">
                  You've reached your free trial limit. Upgrade to continue creating interviews.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <CreateInterviewCard />
        )}

        {interviewsLoading || loading ? (
          <InterviewsLoader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {interviews.map((item) => (
              <InterviewCard
                id={item.id}
                interviewerId={item.interviewer_id}
                key={item.id}
                name={item.name}
                url={item.url ?? ""}
                readableSlug={item.readable_slug}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Gem className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Upgrade to Pro
              </h3>
              <p className="text-gray-600">
                You have reached your limit for the free trial. Upgrade to continue using our features.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex justify-center">
                <Image
                  src={"/premium-plan-icon.png"}
                  alt="Premium Plan"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <Card className="border-2 border-gray-200 hover:border-gray-300 transition-colors">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Free Plan</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        10 Responses
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        Basic Support
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        Limited Features
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Pro Plan</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        Flexible Pay-Per-Response
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        Priority Support
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        All Features
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Contact{" "}
                <span className="font-semibold text-indigo-600">founders@folo-up.co</span>{" "}
                to upgrade your plan.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

export default Interviews;
