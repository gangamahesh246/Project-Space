import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, Eye } from 'lucide-react';

const OngoingExamBanner = ({ exam }) => {
  const [timeRemaining, setTimeRemaining] = useState(exam.timeRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 300) return 'text-red-600'; // Last 5 minutes
    if (timeRemaining <= 900) return 'text-yellow-600'; // Last 15 minutes
    return 'text-green-600';
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 mb-8 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Exam in Progress</h3>
            <p className="text-blue-100">{exam.examTitle}</p>
            <p className="text-sm text-blue-200">Faculty: {exam.faculty}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm">Time Remaining</span>
          </div>
          <div className={`text-3xl font-mono font-bold ${getTimeColor()}`}>
            {formatTime(timeRemaining)}
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <button className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            <Eye className="w-4 h-4" />
            <span>Resume Exam</span>
          </button>
          <div className="text-xs text-blue-200 text-center">
            Started: {exam.startTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OngoingExamBanner;