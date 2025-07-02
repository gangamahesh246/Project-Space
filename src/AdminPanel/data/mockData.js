export const examMetrics = {
  totalExams: 153,
  totalStudents: 2847,
  totalFaculty: 45,
  activeExams: 12,
  completedExams: 141,
  flaggedEvents: 23
};

export const examTrendsData = [
  { label: 'Jan', value: 12, date: '2024-01' },
  { label: 'Feb', value: 18, date: '2024-02' },
  { label: 'Mar', value: 15, date: '2024-03' },
  { label: 'Apr', value: 22, date: '2024-04' },
  { label: 'May', value: 28, date: '2024-05' },
  { label: 'Jun', value: 25, date: '2024-06' },
  { label: 'Jul', value: 33, date: '2024-07' }
];

export const participationData = [
  { label: 'Mathematics 101', value: 95 },
  { label: 'Physics Advanced', value: 87 },
  { label: 'Chemistry Lab', value: 92 },
  { label: 'Biology Final', value: 89 },
  { label: 'Statistics', value: 96 }
];

export const averageScoresData = [
  { label: 'Data Structures', value: 78 },
  { label: 'Web Development', value: 85 },
  { label: 'Machine Learning', value: 72 },
  { label: 'Database Systems', value: 81 },
  { label: 'Software Engineering', value: 88 }
];

export const proctorAlertsData = [
  { label: 'Tab Switch', value: 35 },
  { label: 'Camera Off', value: 28 },
  { label: 'Multiple Faces', value: 15 },
  { label: 'Audio Issues', value: 12 },
  { label: 'Suspicious Movement', value: 10 }
];

export const recentExamActivity = [
  {
    id: '1',
    examName: 'Advanced Mathematics Final',
    faculty: 'Dr. Sarah Johnson',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'Live'
  },
  {
    id: '2',
    examName: 'Physics Midterm',
    faculty: 'Prof. Michael Chen',
    date: '2024-01-15',
    time: '2:00 PM',
    status: 'Scheduled'
  },
  {
    id: '3',
    examName: 'Chemistry Lab Assessment',
    faculty: 'Dr. Emily Rodriguez',
    date: '2024-01-14',
    time: '9:00 AM',
    status: 'Completed'
  },
  {
    id: '4',
    examName: 'Biology Quiz 3',
    faculty: 'Prof. David Kim',
    date: '2024-01-14',
    time: '11:30 AM',
    status: 'Completed'
  },
  {
    id: '5',
    examName: 'Statistics Final',
    faculty: 'Dr. Lisa Wang',
    date: '2024-01-16',
    time: '1:00 PM',
    status: 'Scheduled'
  }
];

export const studentPerformanceData = [
  {
    id: '1',
    studentName: 'Alex Thompson',
    studentId: 'ST2024001',
    examName: 'Advanced Mathematics Final',
    score: 92,
    rank: 1,
    flags: 0
  },
  {
    id: '2',
    studentName: 'Maya Patel',
    studentId: 'ST2024002',
    examName: 'Advanced Mathematics Final',
    score: 88,
    rank: 2,
    flags: 1
  },
  {
    id: '3',
    studentName: 'James Wilson',
    studentId: 'ST2024003',
    examName: 'Physics Midterm',
    score: 85,
    rank: 3,
    flags: 0
  },
  {
    id: '4',
    studentName: 'Sophie Chen',
    studentId: 'ST2024004',
    examName: 'Chemistry Lab Assessment',
    score: 91,
    rank: 1,
    flags: 2
  },
  {
    id: '5',
    studentName: 'Marcus Johnson',
    studentId: 'ST2024005',
    examName: 'Biology Quiz 3',
    score: 78,
    rank: 8,
    flags: 3
  }
];

export const cheatingFlagsData = [
  {
    id: '1',
    studentName: 'Maya Patel',
    exam: 'Advanced Mathematics Final',
    flagType: 'Tab Switch Detected',
    timestamp: '2024-01-15 10:23:45',
    actionTaken: 'Warning Issued',
    severity: 'Medium'
  },
  {
    id: '2',
    studentName: 'Sophie Chen',
    exam: 'Chemistry Lab Assessment',
    flagType: 'Multiple Faces in Frame',
    timestamp: '2024-01-14 09:45:12',
    actionTaken: 'Exam Paused',
    severity: 'High'
  },
  {
    id: '3',
    studentName: 'Marcus Johnson',
    exam: 'Biology Quiz 3',
    flagType: 'Camera Turned Off',
    timestamp: '2024-01-14 11:52:30',
    actionTaken: 'Auto-Submit',
    severity: 'High'
  },
  {
    id: '4',
    studentName: 'Emma Davis',
    exam: 'Statistics Midterm',
    flagType: 'Suspicious Movement',
    timestamp: '2024-01-13 14:18:55',
    actionTaken: 'Under Review',
    severity: 'Low'
  },
  {
    id: '5',
    studentName: 'Ryan Zhang',
    exam: 'Physics Final',
    flagType: 'Audio Anomaly',
    timestamp: '2024-01-12 16:07:22',
    actionTaken: 'Cleared',
    severity: 'Low'
  }
];