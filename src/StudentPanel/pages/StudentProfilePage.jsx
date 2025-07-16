import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  User,
  Phone,
  Pencil,
  Save,
  Calendar,
  Mail,
  MapPin,
  GraduationCap,
  Award,
  Target,
  TrendingUp,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Star,
  Trophy,
} from "lucide-react";
import axiosStudent from "../../utils/axiosStudent";

const StudentProfilePage = () => {
  const student = useSelector((state) => state.student.user);

  const initialForm = {
    fullname: "",
    username: student.username,
    email: student.college_mail,
    phone: "",
    technology: "",
    college: "",
    department: "",
    yearOfStudy: "",
    rollNumber: student.college_mail.split("@")[0],
    skills: [],
    achievements: [],
    dateOfBirth: "",
    gender: "",
    address: "",
    bio: "",
    guardianName: "",
    guardianphone: "",
    password: "",
  };

  const [form, setForm] = useState(initialForm);
  const [isFocused, setIsFocused] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);
  const [examsData, setExamsData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [recentExamsData, setRecentExamsData] = useState([
    {
      title: "",
      marks: "",
      date: "",
      status: "",
    },
  ]);

  useEffect(() => {
    if (!student.college_mail) return;

    axiosStudent
      .get("/getstudentId", {
        params: {
          student_mail: student.college_mail,
        },
      })
      .then((response) => {
        setStudentId(response.data.studentId);
      })
      .catch((error) => {
        console.error("Error fetching student ID:", error);
      });
  }, [student.college_mail]);

  useEffect(() => {
    const formatDate = (isoString) => {
      const date = new Date(isoString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const recentAttempts = examsData
      .flatMap((exam) => exam.attempts || [])
      .sort(
        (a, b) =>
          new Date(b.attemptStart?.["$date"]) -
          new Date(a.attemptStart?.["$date"])
      )
      .slice(0, 5)
      .map((attempt) => ({
        title: attempt.stats?.title || "",
        marks: attempt.stats?.score ?? "",
        date: formatDate(attempt.stats?.startTime),
        status: attempt.result || "",
      }));

    setRecentExamsData(recentAttempts);
  }, [examsData]);

  useEffect(() => {
    if (!studentId) return;

    axiosStudent
      .get("/student", {
        params: { student_id: studentId },
      })
      .then((res) => {
        setExamsData(res.data.exams);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [studentId]);

  useEffect(() => {
    axiosStudent
      .get("/student/getprofile/", {
        params: { email: student.college_mail },
      })
      .then((res) => {
        const backend = res.data;

        setStudentData({
          ...backend,
          examStats: {
            totalExams: examsData.length,
            examsPassed: examsData.filter((e) =>
              e?.attempts?.some((a) => a?.result === "pass")
            ).length,
            examsFailed: examsData.filter((e) =>
              e?.attempts?.some((a) => a?.result === "fail")
            ).length,
            averageMarks: calculateAverageScore(examsData),
            passPercentage: calculatePassPercentage(examsData),
            highestMarks: getHighestScore(examsData),
            lowestMarks: getLowestScore(examsData),
            recentAccuracy: calculateRecentScore(examsData),
            // leaderboardRank: backend.rank || 0,
            // totalStudents: backend.totalStudents || 0,
          },
          achievements: [
            "Best Student Award 2023",
            "Coding Competition Winner",
            "Academic Excellence Certificate",
            "Leadership Award",
          ],
        });

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [student.college_mail]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!studentData)
    return <div className="text-center p-4">No data available</div>;

  const {
    fullname,
    rollNumber,
    yearOfStudy,
    department,
    technology,
    email,
    phone,
    guardianName,
    guardianphone,
    address,
    college,
    dateOfBirth,
    skills,
    examStats,
    achievements,
  } = studentData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...form.skills];
    updatedSkills[index] = value;
    setForm({ ...form, skills: updatedSkills });
  };

  const addSkill = () => {
    setForm({ ...form, skills: [...form.skills, ""] });
  };

  const handleAchievementChange = (index, value) => {
    const updated = [...form.achievements];
    updated[index] = value;
    setForm({ ...form, achievements: updated });
  };

  const addAchievement = () => {
    setForm({ ...form, achievements: [...form.achievements, ""] });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        skills: form.skills,
      };

      await axiosStudent.post("/student/profile", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axiosStudent.put("/change-studentpassword", {
        newPassword,
      });

      toast.success(res.data.message || "Password changed successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-white px-8 py-4">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={`https://info.aec.edu.in/ACET/StudentPhotos/${
                    student.college_mail.split("@")[0]
                  }.jpg`}
                  alt={`Profile of ${fullname}`}
                  className="w-35 h-45 rounded object-center shadow-lg border-4 border-white/10"
                />
              </div>
              <div className="text-center md:text-left ">
                <div>
                  <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold mb-2">{fullname}</h1> 
                    <button
                      onClick={() => {
                        if (isEditing) handleSubmit();
                        setIsEditing(!isEditing);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 transition-all flex items-center gap-1"
                    >
                      {isEditing ? (
                        <Save className="w-5 h-5" />
                      ) : (
                        <Pencil className="w-5 h-5" />
                      )}
                          {isEditing ? "Save" : "Edit"} 
                    </button>
                  </div>
                </div>
                <p className="text-lg mb-1">{rollNumber}</p>
                <p className="mb-2">{college}</p>
                <p>
                  {department} - {technology}
                </p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  {skills.slice(0, 4).map((skill, i) => (
                    <span
                      key={i}
                      className="bg-green-500/20 backdrop-blur-sm text-green-500 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {skills.length > 4 && (
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      +{skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Target className="w-8 h-8" />}
            title="Total Exam Accuracy"
            value={`${examStats.averageMarks}%`}
            subtitle="Across all exams"
            color="bg-blue-500"
          />

          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Average Accuracy"
            value={`${examStats.recentAccuracy}%`}
            subtitle="Based on last 5 exams"
            color="bg-green-500"
          />

          <StatCard
            icon={<Award className="w-8 h-8" />}
            title="Pass Percentage"
            value={`${examStats.passPercentage}%`}
            subtitle={`${examStats.examsPassed}/${examStats.totalExams} passed`}
            color="bg-purple-500"
          />

          <StatCard
            icon={<Trophy className="w-8 h-8" />}
            title="Leaderboard Rank"
            value={`#${examStats.leaderboardRank}`}
            subtitle={`Out of ${examStats.totalStudents}`}
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                Personal Information
              </h2>
              <div className="space-y-4">
                <InfoItem
                  label="Year of Study"
                  icon={<GraduationCap className="w-4 h-4" />}
                  value={
                    isEditing ? (
                      <input
                        type="number"
                        name="Year of Study"
                        value={form.yearOfStudy}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      yearOfStudy
                    )
                  }
                />
                <InfoItem
                  label="Email"
                  icon={<Mail className="w-4 h-4" />}
                  value={
                    isEditing ? (
                      <input
                        type="email"
                        name="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      email
                    )
                  }
                />
                <InfoItem
                  label="Phone"
                  icon={<Phone className="w-4 h-4" />}
                  value={
                    isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      phone
                    )
                  }
                />
                <InfoItem
                  label="Date of Birth"
                  icon={<Calendar className="w-4 h-4" />}
                  value={
                    isEditing ? (
                      <input
                        type="number"
                        name="Date of Birth"
                        value={new Date(form.dateOfBirth).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      dateOfBirth
                    )
                  }
                />
                <InfoItem
                  label="Address"
                  icon={<MapPin className="w-4 h-4" />}
                  value={
                    isEditing ? (
                      <input
                        type="text"
                        name="Address"
                        value={form.address}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      address
                    )
                  }
                />
                <InfoItem
                  label="Guardian"
                  icon={<User className="w-4 h-4" />}
                  value={
                    isEditing ? (
                      <input
                        type="text"
                        name="Guardian"
                        value={`${form.guardianName} (${form.guardianName})`}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      guardianName + " (" + guardianphone + ")"
                    )
                  }
                />
                <InfoItem
                  icon={<User className="w-4 h-4" />}
                  label="Guardian"
                  value={`${guardianName} (${guardianphone})`}
                />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-indigo-600" />
                Skills & Achievements
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                      <>
                        {form.skills.map((skill, index) => (
                          <input
                            key={index}
                            type="text"
                            value={skill}
                            onChange={(e) =>
                              handleSkillChange(index, e.target.value)
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-sm mr-2 mb-2"
                          />
                        ))}
                        <button
                          onClick={addSkill}
                          className="text-indigo-600 text-sm hover:underline"
                        >
                                + Add Skill  
                        </button>
                      </>
                    ) : (
                      <>
                        {skills.map((skill, i) => (
                          <span
                            key={i}
                            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                                    {skill}     
                          </span>
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Achievements
                  </h3>
                  <div className="space-y-2">
                    {isEditing ? (
                      <>
                        {form.achievements.map((ach, index) => (
                          <input
                            key={index}
                            type="text"
                            value={ach}
                            onChange={(e) =>
                              handleAchievementChange(index, e.target.value)
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-sm w-full mb-2"
                          />
                        ))}
                           {" "}
                        <button
                          onClick={addAchievement}
                          className="text-indigo-600 text-sm hover:underline"
                        >
                                + Add Achievement    
                        </button>
                      </>
                    ) : (
                      <>
                        {achievements.map((achievement, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-yellow-500" />      
                            <span className="text-sm text-gray-600">
                              {achievement}
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Performance Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PerformanceCard
                  title="Exams Written"
                  value={examStats.totalExams}
                  description="Total examinations"
                  color="bg-blue-50 text-blue-600"
                />
                <PerformanceCard
                  title="Exams Passed"
                  value={examStats.examsPassed}
                  description="Successfully completed"
                  color="bg-green-50 text-green-600"
                />
                <PerformanceCard
                  title="Total Exams Attempted"
                  value={examStats.totalExams}
                  description="All tests attended"
                  color="bg-blue-50 text-blue-600"
                />

                <PerformanceCard
                  title="Top Score Achieved"
                  value={`${examStats.highestMarks}`}
                  description="Most successful attempt"
                  color="bg-purple-50 text-purple-600"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Recent Examinations
              </h2>
              <div className="space-y-4">
                {recentExamsData.map((exam, i) => (
                  <ExamCard
                    key={`${exam.title}-${exam.date}`}
                    exam={{ ...exam, technology: exam.title }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;

const StatCard = ({ icon, title, value, subtitle, color }) => (
  <>
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-4">
        <div className={`${color} p-3 rounded-xl text-white`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  </>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-indigo-600">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-sm text-gray-600">{value}</p>
    </div>
  </div>
);

const PerformanceCard = ({ title, value, description, color }) => (
  <>
    <div className="p-4 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {value}
        </span>
      </div>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  </>
);

const ExamCard = ({ exam }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-full ${
          exam.status === "pass" ? "bg-green-100" : "bg-red-100"
        }`}
      >
        {exam.status === "pass" ? (
          <CheckCircle className="w-4 h-4 text-green-600" />
        ) : (
          <XCircle className="w-4 h-4 text-red-600" />
        )}
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{exam.title}</h3>
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(exam.date).toLocaleDateString("en-GB")}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-lg font-bold text-gray-800">{exam.marks}</p>
    </div>
  </div>
);

const calculateAverageScore = (exams) => {
  let scores = [];
  exams.forEach((exam) => {
    exam.attempts?.forEach((a) => {
      if (typeof a?.score === "number") scores.push(a.score);
    });
  });
  if (scores.length === 0) return 0;
  return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
};

const calculatePassPercentage = (exams) => {
  const total = exams.length;
  const passed = exams.filter((e) =>
    e.attempts?.some((a) => a.result === "pass")
  ).length;
  return total === 0 ? 0 : ((passed / total) * 100).toFixed(2);
};

const getHighestScore = (exams) => {
  let scores = [];
  exams.forEach((exam) =>
    exam.attempts?.forEach((a) => {
      if (typeof a?.score === "number") scores.push(a.score);
    })
  );
  return scores.length === 0 ? 0 : Math.max(...scores);
};

const getLowestScore = (exams) => {
  let scores = [];
  exams.forEach((exam) =>
    exam.attempts?.forEach((a) => {
      if (typeof a?.score === "number") scores.push(a.score);
    })
  );
  return scores.length === 0 ? 0 : Math.min(...scores);
};

const calculateRecentScore = (exams) => {
  let recentAttempts = exams
    .flatMap((exam) => exam.attempts || [])
    .sort((a, b) => new Date(b.attemptStart) - new Date(a.attemptStart))
    .slice(0, 5);
  let scores = recentAttempts.map((a) => a.score).filter(Boolean);
  return scores.length === 0
    ? 0
    : (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
};
