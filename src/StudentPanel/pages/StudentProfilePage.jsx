import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

const StudentProfilePage = () => {
  const student = useSelector((state) => state.student.user);
  const [PreviewImage, setPreviewImage] = useState("");
  const [file, setFile] = useState(null);

  const initialForm = {
    userId: "",
    fullname: "",
    username: "",
    email: "",
    phone: "",
    photo: "",
    college: "",
    department: "",
    yearOfStudy: 1,
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

  useEffect(() => {
    axiosInstance
      .get("/student/getprofile", {
        params: { userId: student.student_id },
      })
      .then((response) => {
        const data = response.data;
        setForm({
          ...data,
          dateOfBirth: data.dateOfBirth?.split("T")[0] || "",
        });
      })
      .catch((err) => {
        toast.error("Error fetching student profile");
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
      const formData = new FormData();
      for (let key in form) {
        if (key === "skills") {
          formData.append("skills", JSON.stringify(form.skills));
        } else if (key === "photo" && form.photo instanceof File) {
          formData.append("photo", form.photo);
        } else {
          formData.append(key, form[key]);
        }
      }

      await axiosInstance.post("/student/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="w-full h-fit bg-aliceblue sm:p-3 xl:p-10 flex justify-center items-center">
      <div className="sm:w-78 sm:p-5 md:w-145 xl:w-4/5 h-fit xl:mx-auto bg-white shadow-lg rounded-lg xl:p-8">
        <form>
          <div
            className="w-40 h-50 rounded-lg border-2 border-green-500 mb-6 ml-2 flex justify-center items-center cursor-pointer"
            style={{
              backgroundImage: `url(https://info.aec.edu.in/ACET/StudentPhotos/${student.student_id.split("@")[0]}.jpg)`,
              backgroundSize: "cover" ,
              backgroundPosition: "center",
            }}
          >
          </div>

        
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
            className="input-style"
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="input-style"
          />
          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            className="input-style"
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="input-style"
          >
              <option value="">Select Gender</option> {" "}
            <option value="Male">Male</option> {" "}
            <option value="Female">Female</option> {" "}
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

          {/* Skills Section */}
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

          {/* Institute Section */}
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

          {/* Guardian Section */}
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

          {/* Account Info */}
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
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="input-style"
          />
        </form>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-green-500 p-2 rounded text-white cursor-pointer outline-none"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
