import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosStudent from "../../utils/axiosStudent";

const StudentProfilePage = () => {
  const student = useSelector((state) => state.student.user);

  const initialForm = {
    fullname: "",
    username: student.username,
    email: student.college_mail,
    phone: "",
    college: "",
    department: "",
    yearOfStudy: "",
    rollNumber: "",
    skills: [],
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

  useEffect(() => {
    axiosStudent
      .get("/student/getprofile", {
        params: { email: student.college_mail },
      })
      .then((response) => {
        const data = response.data;
        setForm({
          ...data,
          dateOfBirth: data.dateOfBirth?.split("T")[0] || "",
        });
      })
      .catch((err) => {
        console.log("Error fetching student profile");
      });
  }, []);

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
    <div className="w-full h-fit bg-aliceblue sm:p-3 xl:p-10 flex justify-center items-center">
      <div className="sm:w-95 sm:p-5 md:w-145 xl:w-4/5 h-fit xl:mx-auto bg-white shadow-lg rounded-lg xl:p-8">
        <form>
          <div
            className="w-40 h-50 rounded-lg border-2 border-green-500 mb-6 ml-2 flex justify-center items-center cursor-pointer"
            style={{
              backgroundImage: `url(https://info.aec.edu.in/ACET/StudentPhotos/${
                student.college_mail.split("@")[0]
              }.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          <h2 className="text-xl font-bold mb-6 border-l-4 pl-2 border-secondary">
            Student Profile
          </h2>

          <input
            name="fullname"
            placeholder="Full Name"
            value={form.fullname}
            onChange={handleChange}
            className="input-style"
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            readOnly
            className="input-style"
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="input-style"
          />
          <div className="relative w-full">
            <input
              type={isFocused || form.dateOfBirth ? "date" : "text"}
              name="dateOfBirth"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              value={form.dateOfBirth}
              onChange={handleChange}
              className="input-style"
            />
            {!form.dateOfBirth && (
              <span className="absolute left-3 top-2 text-gray-500 text-md pointer-events-none">
                {isFocused ? "" : "DOB"}
              </span>
            )}
          </div>

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="input-style"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="input-style"
          />
          <textarea
            name="bio"
            placeholder="Bio"
            value={form.bio}
            onChange={handleChange}
            className="input-style"
            maxLength={500}
          />

          <h2 className="text-xl font-bold mb-6 border-l-4 pl-2 border-secondary">
            Skills
          </h2>

          {form.skills.map((skill, index) => (
            <input
              key={index}
              placeholder={`Skill ${index + 1}`}
              value={skill}
              onChange={(e) => handleSkillChange(index, e.target.value)}
              className="input-style"
            />
          ))}

          <button
            type="button"
            onClick={addSkill}
            className="text-blue-500 mb-6 cursor-pointer"
          >
            + Add another skill
          </button>

          <h2 className="text-xl font-bold mb-6 border-l-4 pl-2 border-secondary">
            Institute Information
          </h2>

          <input
            name="college"
            placeholder="College"
            value={form.college}
            onChange={handleChange}
            className="input-style"
          />
          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            className="input-style"
          />
          <input
            type="number"
            name="yearOfStudy"
            placeholder="Year of Study"
            value={form.yearOfStudy}
            onChange={handleChange}
            className="input-style"
          />
          <input
            name="rollNumber"
            placeholder="Roll Number"
            value={form.rollNumber}
            onChange={handleChange}
            className="input-style"
          />

          <h2 className="text-xl font-bold mb-6 border-l-4 pl-2 border-secondary">
            Guardian Information
          </h2>

          <input
            name="guardianName"
            placeholder="Guardian Name"
            value={form.guardianName}
            onChange={handleChange}
            className="input-style"
          />
          <input
            name="guardianphone"
            placeholder="Guardian Phone"
            value={form.guardianphone}
            onChange={handleChange}
            className="input-style"
          />

          <h2 className="text-xl font-bold mb-6 border-l-4 pl-2 border-secondary">
            Account Info
          </h2>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="input-style"
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-start gap-3">
              <input
                type="password"
                value="********"
                readOnly
                className="input-style bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowChangePassword(true)}
                className="px-4 py-[11px] bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition duration-200 cursor-pointer"
              >
                Change
              </button>
            </div>
          </div>
          {showChangePassword && (
            <div className="mt-4 space-y-3">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-style"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-style"
              />
              <button
                type="button"
                onClick={handleChangePassword}
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 cursor-pointer"
              >
                Save New Password
              </button>
            </div>
          )}
        </form>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-green-500 px-5 py-2 rounded text-white cursor-pointer outline-none"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
