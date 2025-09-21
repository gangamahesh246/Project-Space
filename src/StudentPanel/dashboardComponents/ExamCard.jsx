import React from "react";
import {
  Clock,
  User,
  Play,
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExamCard = ({ exam, type }) => {
  const navigate = useNavigate();

  const isUpcoming = type === "upcoming";
  const isCompleted = type === "completed";

  const now = new Date();
  const examStart = new Date(exam.startTime); // or exam.settings?.availability?.timeLimitHours?.from
  const examEnd = new Date(exam.endTime); // optional, for extra validation

  const hoursUntilStart = (examStart - now) / (1000 * 60 * 60); // in hours

  const hasStarted = now >= examStart;
  const hasEnded = now >= examEnd; // optional

  // pass this to your component
  exam.hoursUntil = hoursUntilStart;
  exam.hasStarted = hasStarted;
  exam.hasEnded = hasEnded;

  const getStatusColor = (status) => {
    switch (status) {
      case "pass":
        return "text-green-600 bg-green-100";
      case "fail":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getUrgencyColor = (hoursUntil) => {
    if (hoursUntil <= 2) return "border-red-200 bg-red-50";
    if (hoursUntil <= 24) return "border-yellow-200 bg-yellow-50";
    return "border-gray-200 bg-white";
  };

  return (
    <div
      className={`rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${
        isUpcoming
          ? getUrgencyColor(exam.hoursUntil)
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="capitalize font-semibold text-gray-900 mb-1">
            {exam.examTitle}
          </h4>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="capitalize flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{exam.faculty}</span>
            </div>
            {isUpcoming && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{exam.duration} hours</span>
              </div>
            )}
          </div>
        </div>
        {isCompleted && (
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {exam.score}
            </span>
            {exam.status === "pass" ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{exam.date}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            {exam.time && (
              <>
                <Clock className="w-4 h-4" />
                <span>{exam.time}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isUpcoming && !exam.hasStarted && exam.hoursUntil <= 2 && (
            <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
              Starting Soon
            </span>
          )}

          {isUpcoming && exam.hasStarted && (
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              Ongoing
            </span>
          )}

          {isCompleted && (
            <span
              className={`text-xs font-medium capitalize px-3 py-1 rounded-full ${getStatusColor(
                exam.status
              )}`}
            >
              {exam.status}
            </span>
          )}
          {isUpcoming && exam.canStart && (
            <button className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <Play className="w-4 h-4" />
              <span>Start Exam</span>
            </button>
          )}
          {isCompleted && (
            <button
              onClick={() =>
                navigate("/student/exam/rankbyexam", {
                  state: { examId: exam.id },
                })
              }
              className="flex items-center space-x-1 bg-amber-100 text-amber-500 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-200 cursor-pointer transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>View Results</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
