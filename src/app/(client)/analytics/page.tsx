"use client";

import React, { useState, useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Clock, Target } from "lucide-react";
import { InterviewService } from "@/services/interviews.service";
import { ResponseService } from "@/services/responses.service";

interface AnalyticsData {
  totalInterviews: number;
  totalResponses: number;
  averageResponseTime: number;
  completionRate: number;
  monthlyData: Array<{ month: string; responses: number }>;
  responseTrends: Array<{ date: string; responses: number }>;
  interviewerPerformance: Array<{ name: string; responses: number; avgDuration: number }>;
}

export default function Analytics() {
  const { organization } = useOrganization();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalInterviews: 0,
    totalResponses: 0,
    averageResponseTime: 0,
    completionRate: 0,
    monthlyData: [],
    responseTrends: [],
    interviewerPerformance: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!organization?.id) return;

      try {
        setLoading(true);
        
        const interviews = await InterviewService.getAllInterviews("", organization.id);
        const allResponses: any[] = [];
        
        for (const interview of interviews) {
          const responses = await ResponseService.getAllResponses(interview.id);
          allResponses.push(...responses);
        }

        const totalInterviews = interviews.length;
        const totalResponses = allResponses.length;
        const averageResponseTime = allResponses.length > 0 
          ? allResponses.reduce((acc, resp) => acc + (resp.duration || 0), 0) / allResponses.length 
          : 0;
        const completionRate = totalInterviews > 0 ? (totalResponses / totalInterviews) * 100 : 0;

        const monthlyData = generateMonthlyData(allResponses);
        const responseTrends = generateResponseTrends(allResponses);
        const interviewerPerformance = generateInterviewerPerformance(interviews, allResponses);

        setAnalytics({
          totalInterviews,
          totalResponses,
          averageResponseTime: Math.round(averageResponseTime),
          completionRate: Math.round(completionRate),
          monthlyData,
          responseTrends,
          interviewerPerformance
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [organization]);

  const generateMonthlyData = (responses: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyCounts = new Array(12).fill(0);
    
    responses.forEach(response => {
      const month = new Date(response.created_at).getMonth();
      monthlyCounts[month]++;
    });

    return months.map((month, index) => ({
      month,
      responses: monthlyCounts[index]
    }));
  };

  const generateResponseTrends = (responses: any[]) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayResponses = responses.filter(response => {
        const responseDate = new Date(response.created_at);
        return responseDate.toDateString() === date.toDateString();
      });
      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        responses: dayResponses.length
      });
    }
    return last7Days;
  };

  const generateInterviewerPerformance = (interviews: any[], responses: any[]) => {
    const performance: Record<string, { name: string; responses: number; avgDuration: number }> = {};
    
    interviews.forEach(interview => {
      const interviewResponses = responses.filter(resp => resp.interview_id === interview.id);
      if (!performance[interview.interviewer_id]) {
        performance[interview.interviewer_id] = {
          name: `Interviewer ${interview.interviewer_id}`,
          responses: 0,
          avgDuration: 0
        };
      }
      performance[interview.interviewer_id].responses += interviewResponses.length;
      if (interviewResponses.length > 0) {
        const avgDuration = interviewResponses.reduce((acc, resp) => acc + (resp.duration || 0), 0) / interviewResponses.length;
        performance[interview.interviewer_id].avgDuration = Math.round(avgDuration);
      }
    });

    return Object.values(performance);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header - Reduced spacing */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your interview performance and insights</p>
      </div>

      {/* Key Metrics - Reduced gap */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Interviews</p>
                <p className="text-2xl font-bold">{analytics.totalInterviews}</p>
              </div>
              <Target className="h-6 w-6 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Responses</p>
                <p className="text-2xl font-bold">{analytics.totalResponses}</p>
              </div>
              <Users className="h-6 w-6 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Avg Response Time</p>
                <p className="text-2xl font-bold">{analytics.averageResponseTime}m</p>
              </div>
              <Clock className="h-6 w-6 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Completion Rate</p>
                <p className="text-2xl font-bold">{analytics.completionRate}%</p>
              </div>
              <TrendingUp className="h-6 w-6 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Reduced spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <CardTitle className="mb-3 text-lg">Monthly Response Trends</CardTitle>
            <div className="space-y-2">
              {analytics.monthlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-8">{data.month}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${Math.max((data.responses / Math.max(...analytics.monthlyData.map(d => d.responses))) * 100, 5)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{data.responses}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <CardTitle className="mb-3 text-lg">Last 7 Days Activity</CardTitle>
            <div className="space-y-2">
              {analytics.responseTrends.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-16">{data.date}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${Math.max((data.responses / Math.max(...analytics.responseTrends.map(d => d.responses))) * 100, 5)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{data.responses}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interviewer Performance - Reduced spacing */}
      {analytics.interviewerPerformance.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <CardTitle className="mb-3 text-lg">Interviewer Performance</CardTitle>
            <div className="space-y-3">
              {analytics.interviewerPerformance.map((interviewer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{interviewer.name}</h3>
                    <p className="text-sm text-gray-600">{interviewer.responses} responses</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Avg Duration</p>
                    <p className="font-semibold text-gray-900">{interviewer.avgDuration}m</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
