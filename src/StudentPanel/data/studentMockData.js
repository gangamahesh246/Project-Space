export const studentMetrics = {
  examsCompleted: 12,
  averageScore: 85,
  upcomingExams: 3,
  totalFlags: 4
};

export const performanceTrendData = [
  { label: 'Math 101', value: 78, date: '2024-01-05' },
  { label: 'Physics', value: 82, date: '2024-01-12' },
  { label: 'Chemistry', value: 88, date: '2024-01-19' },
  { label: 'Biology', value: 85, date: '2024-01-26' },
  { label: 'Statistics', value: 91, date: '2024-02-02' },
  { label: 'Calculus', value: 87, date: '2024-02-09' },
  { label: 'Data Structures', value: 89, date: '2024-02-16' }
];

export const scoreDistributionData = [
  { label: 'Mathematics 101', value: 78 },
  { label: 'Physics Advanced', value: 82 },
  { label: 'Chemistry Lab', value: 88 },
  { label: 'Biology Final', value: 85 },
  { label: 'Statistics', value: 91 },
  { label: 'Calculus II', value: 87 }
];

export const timeTakenData = [
  { label: 'Data Structures Final', value: 95 },
  { label: 'Web Development Quiz', value: 78 },
  { label: 'Machine Learning Test', value: 88 },
  { label: 'Database Systems', value: 92 },
  { label: 'Software Engineering', value: 85 }
];

export const proctorFlagsData = [
  { label: 'Tab Switch', value: 2 },
  { label: 'Camera Off', value: 1 },
  { label: 'Audio Issues', value: 1 }
];

export const upcomingExams = [
  {
    id: '1',
    examTitle: 'Advanced Algorithms Final',
    faculty: 'Dr. Sarah Johnson',
    date: '2024-02-20',
    time: '10:00 AM',
    duration: '3 hours',
    hoursUntil: 2,
    canStart: true
  },
  {
    id: '2',
    examTitle: 'Database Systems Midterm',
    faculty: 'Prof. Michael Chen',
    date: '2024-02-22',
    time: '2:00 PM',
    duration: '2 hours',
    hoursUntil: 26,
    canStart: false
  },
  {
    id: '3',
    examTitle: 'Software Engineering Quiz',
    faculty: 'Dr. Emily Rodriguez',
    date: '2024-02-25',
    time: '11:00 AM',
    duration: '1 hour',
    hoursUntil: 98,
    canStart: false
  }
];

export const completedExams = [
  {
    id: '1',
    examTitle: 'Data Structures Final',
    faculty: 'Prof. David Kim',
    date: '2024-02-16',
    time: '9:00 AM',
    score: 89,
    status: 'Passed',
    resultDate: '2024-02-18'
  },
  {
    id: '2',
    examTitle: 'Web Development Project',
    faculty: 'Dr. Lisa Wang',
    date: '2024-02-14',
    time: '1:00 PM',
    score: 92,
    status: 'Passed',
    resultDate: '2024-02-16'
  },
  {
    id: '3',
    examTitle: 'Machine Learning Quiz',
    faculty: 'Prof. James Wilson',
    date: '2024-02-12',
    time: '3:00 PM',
    score: 76,
    status: 'Passed',
    resultDate: '2024-02-14'
  },
  {
    id: '4',
    examTitle: 'Statistics Midterm',
    faculty: 'Dr. Maria Garcia',
    date: '2024-02-09',
    time: '10:30 AM',
    score: 58,
    status: 'Failed',
    resultDate: '2024-02-11'
  }
];

export const examHistoryData = [
  {
    id: '1',
    examName: 'Data Structures Final',
    date: '2024-02-16',
    score: 89,
    status: 'Passed',
    proctorAlerts: 1
  },
  {
    id: '2',
    examName: 'Web Development Project',
    date: '2024-02-14',
    score: 92,
    status: 'Passed',
    proctorAlerts: 0
  },
  {
    id: '3',
    examName: 'Machine Learning Quiz',
    date: '2024-02-12',
    score: 76,
    status: 'Passed',
    proctorAlerts: 2
  },
  {
    id: '4',
    examName: 'Statistics Midterm',
    date: '2024-02-09',
    score: 58,
    status: 'Failed',
    proctorAlerts: 3
  },
  {
    id: '5',
    examName: 'Calculus II Final',
    date: '2024-02-07',
    score: 87,
    status: 'Passed',
    proctorAlerts: 0
  },
  {
    id: '6',
    examName: 'Physics Advanced',
    date: '2024-02-05',
    score: 82,
    status: 'Passed',
    proctorAlerts: 1
  }
];

export const proctorFlagRecords = [
  {
    id: '1',
    exam: 'Statistics Midterm',
    timestamp: '2024-02-09 10:45:23',
    flagType: 'Tab Switch Detected',
    severity: 'Medium',
    description: 'Student switched to another browser tab during exam'
  },
  {
    id: '2',
    exam: 'Statistics Midterm',
    timestamp: '2024-02-09 11:12:45',
    flagType: 'Camera Obstruction',
    severity: 'High',
    description: 'Camera view was blocked for 15 seconds'
  },
  {
    id: '3',
    exam: 'Machine Learning Quiz',
    timestamp: '2024-02-12 15:23:12',
    flagType: 'Multiple Faces Detected',
    severity: 'High',
    description: 'Additional person detected in camera frame'
  },
  {
    id: '4',
    exam: 'Machine Learning Quiz',
    timestamp: '2024-02-12 15:45:33',
    flagType: 'Audio Anomaly',
    severity: 'Low',
    description: 'Unusual background noise detected'
  },
  {
    id: '5',
    exam: 'Data Structures Final',
    timestamp: '2024-02-16 09:34:56',
    flagType: 'Suspicious Movement',
    severity: 'Low',
    description: 'Student looked away from screen for extended period'
  }
];

export const ongoingExam = {
  examTitle: 'Advanced Algorithms Final',
  faculty: 'Dr. Sarah Johnson',
  startTime: '10:00 AM',
  timeRemaining: 7200, 
  totalDuration: 10800 
};