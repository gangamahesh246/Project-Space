import React from 'react'
import { 
  BookOpen, 
  Users, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Shield
} from 'lucide-react';

import MetricCard from '../../AdminPanel/dashboardComponents/MetricCard';
import LineChart from '../../AdminPanel/dashboardComponents/LineChart';
import BarChart from '../../AdminPanel/dashboardComponents/BarChart';
import DonutChart from '../../AdminPanel/dashboardComponents/DonutChart';
import DataTable from '../../AdminPanel/dashboardComponents/DataTable';

import {
  examMetrics,
  examTrendsData,
  participationData,
  averageScoresData,
  proctorAlertsData,
  recentExamActivity,
  studentPerformanceData,
  cheatingFlagsData
} from '../../AdminPanel/data/mockData';
import { useSelector } from 'react-redux';


const DashBoard = () => {
  const admin = useSelector((state) => state.login.user._id);
  console.log(admin);

  const examActivityColumns = [
    { key: 'examName', label: 'Exam Name', sortable: true },
    { key: 'faculty', label: 'Faculty', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'time', label: 'Time' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'Live' 
            ? 'bg-red-100 text-red-800'
            : status === 'Scheduled'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-green-100 text-green-800'
        }`}>
          {status}
        </span>
      )
    }
  ];

  const studentPerformanceColumns = [
    { key: 'studentName', label: 'Student Name', sortable: true },
    { key: 'studentId', label: 'Student ID' },
    { key: 'examName', label: 'Exam Name', sortable: true },
    {
      key: 'score',
      label: 'Score',
      sortable: true,
      render: (score) => (
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{score}%</span>
          <div className="w-12 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      )
    },
    { key: 'rank', label: 'Rank', sortable: true },
    {
      key: 'flags',
      label: 'Flags',
      render: (flags) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          flags === 0 
            ? 'bg-green-100 text-green-800'
            : flags <= 2
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {flags}
        </span>
      )
    }
  ];

  const cheatingFlagsColumns = [
    { key: 'studentName', label: 'Student Name', sortable: true },
    { key: 'exam', label: 'Exam', sortable: true },
    { key: 'flagType', label: 'Flag Type' },
    { key: 'timestamp', label: 'Timestamp', sortable: true },
    { key: 'actionTaken', label: 'Action Taken' },
    {
      key: 'severity',
      label: 'Severity',
      render: (severity) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          severity === 'High' 
            ? 'bg-red-100 text-red-800'
            : severity === 'Medium'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-green-100 text-green-800'
        }`}>
          {severity}
        </span>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      <main className="max-w-7xl mx-auto p-3">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Total Exams Conducted"
            value={examMetrics.totalExams}
            icon={BookOpen}
            colorClass="text-blue-600"
            bgColorClass="bg-blue-100"
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Total Students Registered"
            value={examMetrics.totalStudents}
            icon={Users}
            colorClass="text-emerald-600"
            bgColorClass="bg-emerald-100"
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Total Faculty/Test Creators"
            value={examMetrics.totalFaculty}
            icon={UserCheck}
            colorClass="text-purple-600"
            bgColorClass="bg-purple-100"
            trend={{ value: 5, isPositive: true }}
          />
          <MetricCard
            title="Active/Upcoming Exams"
            value={examMetrics.activeExams}
            icon={Clock}
            colorClass="text-amber-600"
            bgColorClass="bg-amber-100"
          />
          <MetricCard
            title="Completed Exams"
            value={examMetrics.completedExams}
            icon={CheckCircle}
            colorClass="text-emerald-600"
            bgColorClass="bg-emerald-100"
            trend={{ value: 15, isPositive: true }}
          />
          <MetricCard
            title="Flagged Proctoring Events"
            value={examMetrics.flaggedEvents}
            icon={AlertTriangle}
            colorClass="text-red-600"
            bgColorClass="bg-red-100"
            trend={{ value: -23, isPositive: false }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-8">
          <div className="xl:col-span-2">
            <LineChart
              data={examTrendsData}
              title="Exams Conducted Over Time"
              color="#3B82F6"
            />
          </div>
          <DonutChart
            data={proctorAlertsData}
            title="Proctoring Alerts Distribution"
          />
          <BarChart
            data={participationData}
            title="Student Participation Rate"
            color="#10B981"
          />
          <div className="lg:col-span-2">
            <BarChart
              data={averageScoresData}
              title="Average Scores per Exam"
              color="#8B5CF6"
              horizontal={true}
            />
          </div>
        </div>

        {/* Tables Section */}
        <div className="space-y-8">
          <DataTable
            title="Recent Exam Activity Log"
            columns={examActivityColumns}
            data={recentExamActivity}
          />
          
          <DataTable
            title="Student Performance Overview"
            columns={studentPerformanceColumns}
            data={studentPerformanceData}
            filterable={true}
          />
          
          <DataTable
            title="Cheating Flags & Security Alerts"
            columns={cheatingFlagsColumns}
            data={cheatingFlagsData}
            filterable={true}
          />
        </div>
      </main>
    </div>
  );
}

export default DashBoard;
