import React from 'react';
import {
  CheckCircle,
  AlertTriangle,
  Calendar,
  TrendingUp
} from 'lucide-react';

import MetricCard from '../dashboardComponents/MetricCard';
import LineChart from '../dashboardComponents/LineChart';
import BarChart from '../dashboardComponents/BarChart';         
import DonutChart from '../dashboardComponents/DonutChart';     
import DataTable from '../dashboardComponents/DataTable';
import ExamCard from '../dashboardComponents/ExamCard';
import OngoingExamBanner from '../dashboardComponents/OngoingExamBanner';

import {
  studentMetrics,
  performanceTrendData,
  scoreDistributionData,
  timeTakenData,
  proctorFlagsData,
  upcomingExams,
  completedExams,
  examHistoryData,
  proctorFlagRecords,
  ongoingExam
} from '../data/studentMockData';

const StudentStatisticsPage = () => {
  const examHistoryColumns = [
    { key: 'examName', label: 'Exam Name', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    {
      key: 'score',
      label: 'Score',
      sortable: true,
      render: (score) => (
        <span className={`font-semibold ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
          {score}%
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'Passed' ? 'bg-green-100 text-green-800'
          : status === 'Failed' ? 'bg-red-100 text-red-800'
          : 'bg-yellow-100 text-yellow-800'
        }`}>
          {status}
        </span>
      )
    },
    {
      key: 'proctorAlerts',
      label: 'Proctoring Alerts',
      render: (alerts) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          alerts === 0 ? 'bg-green-100 text-green-800'
          : alerts <= 2 ? 'bg-yellow-100 text-yellow-800'
          : 'bg-red-100 text-red-800'
        }`}>
          {alerts}
        </span>
      )
    }
  ];

  const proctorFlagColumns = [
    { key: 'exam', label: 'Exam', sortable: true },
    { key: 'timestamp', label: 'Timestamp', sortable: true },
    { key: 'flagType', label: 'Flag Type' },
    {
      key: 'severity',
      label: 'Severity',
      render: (severity) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          severity === 'High' ? 'bg-red-100 text-red-800'
          : severity === 'Medium' ? 'bg-yellow-100 text-yellow-800'
          : 'bg-green-100 text-green-800'
        }`}>
          {severity}
        </span>
      )
    },
    { key: 'description', label: 'Description' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {ongoingExam && <OngoingExamBanner exam={ongoingExam} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Exams Completed"
            value={studentMetrics.examsCompleted}
            icon={CheckCircle}
            colorClass="text-green-600"
            bgColorClass="bg-green-100"
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Average Score"
            value={`${studentMetrics.averageScore}%`}
            icon={TrendingUp}
            colorClass="text-blue-600"
            bgColorClass="bg-blue-100"
            trend={{ value: 5, isPositive: true }}
          />
          <MetricCard
            title="Upcoming Exams"
            value={studentMetrics.upcomingExams}
            icon={Calendar}
            colorClass="text-purple-600"
            bgColorClass="bg-purple-100"
          />
          <MetricCard
            title="Total Flags"
            value={studentMetrics.totalFlags}
            icon={AlertTriangle}
            colorClass="text-red-600"
            bgColorClass="bg-red-100"
            trend={{ value: -15, isPositive: false }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-8">
          <div className="xl:col-span-2">
            <LineChart
              data={performanceTrendData}
              title="Performance Trend Over Time"
              color="#3B82F6"
            />
          </div>
          {proctorFlagsData.length > 0 && (
            <DonutChart
              data={proctorFlagsData}
              title="Proctoring Events Distribution"
            />
          )}
          <BarChart
            data={scoreDistributionData}
            title="Score Distribution per Exam"
            color="#10B981"
          />
          <div className="lg:col-span-2">
            <BarChart
              data={timeTakenData}
              title="Time Taken vs Exam Duration"
              color="#8B5CF6"
              horizontal={true}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Upcoming Exams</span>
              </h3>
              <span className="text-sm text-gray-500">{upcomingExams.length} scheduled</span>
            </div>
            <div className="space-y-4">
              {upcomingExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} type="upcoming" />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Recent Completed Exams</span>
              </h3>
              <span className="text-sm text-gray-500">{completedExams.length} completed</span>
            </div>
            <div className="space-y-4">
              {completedExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} type="completed" />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <DataTable
            title="Exam History"
            columns={examHistoryColumns}
            data={examHistoryData}
            searchable={true}
            filterable={true}
          />

          {proctorFlagRecords.length > 0 && (
            <DataTable
              title="Proctoring Flag Records"
              columns={proctorFlagColumns}
              data={proctorFlagRecords}
              searchable={true}
              filterable={true}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentStatisticsPage;
