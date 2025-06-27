import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

const Profile = () => {
  const data = useSelector((state) => state.login);

  const [PreviewImage, setPreviewImage] = useState("");
  const [file, setFile] = useState(null);

  const initialForm = {
    fullName: "",
    employeeId: "",
    photo: "",
    gender: "",
    dob: "",
    contactNumber: "",
    email: "",
    alternateEmail: "",
    address: "",
    department: "",
    designation: "",
    dateOfJoining: "",
    facultyRoles: "",
    username: "",
    role: "Admin",
    qualifications: [
      {
        degree: "",
        institution: "",
        yearOfPassing: "",
        specialization: "",
        gradeOrPercentage: "",
      },
    ],
  };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    axiosInstance
      .get("/getprofile", {
        params: { employeeId: data.user.employeeId },
      })
      .then((response) => {
        const data = response.data;

        const formatDate = (dateStr) => dateStr?.split("T")[0] || "";

        setForm({
          ...data,
          dob: formatDate(data.dob),
          dateOfJoining: formatDate(data.dateOfJoining),
        });
      })
      .catch((err) => {
        toast.error("Error fetching profile:", err);
      });
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleQualificationChange = (index, e) => {
    const updated = [...form.qualifications];
    updated[index][e.target.name] = e.target.value;
    setForm({ ...form, qualifications: updated });
  };

  const addQualification = () => {
    setForm({
      ...form,
      qualifications: [
        ...form.qualifications,
        {
          degree: "",
          institution: "",
          yearOfPassing: "",
          specialization: "",
          gradeOrPercentage: "",
        },
      ],
    });
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setForm({
        ...form,
        photo: file,
      });
      setPreviewImage(previewURL);
    }
  };

  const handleSubmit = async () => {
    try {
      const url = "http://localhost:3000/profile";

      const formData = new FormData();

      for (let key in form) {
        if (key === "qualifications") {
          formData.append(
            "qualifications",
            JSON.stringify(form.qualifications)
          );
        } else if (key === "photo" && form.photo instanceof File) {
          formData.append("Profile", form.photo);
        } else {
          formData.append(key, form[key]);
        }
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(url, formData, config);

      toast.success(response.data.message || "Profile saved successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full h-fit bg-aliceblue sm:p-3 xl:p-10 flex justify-center items-center">
      <div className="sm:w-78 sm:p-5 md:w-145 xl:w-4/5 h-fit xl:mx-auto bg-white shadow-lg rounded-lg xl:p-8">
        <form>
          <div
            className="w-50 h-50 rounded-lg border-2 border-green-500 mb-6 ml-2 flex justify-center items-center cursor-pointer"
            style={{
              backgroundImage: `url(${encodeURI(PreviewImage || form.photo)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
          </div>
          <h2 className="text-xl font-bold mb-6 border-l-4 pl-2 border-secondary">
            Personal Information
          </h2>

          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
          />

          <input
            name="employeeId"
            placeholder="Employee ID"
            value={form.employeeId}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
          />

          <input
            name="contactNumber"
            placeholder="Contact Number"
            value={form.contactNumber}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
          />

          <input
            name="email"
            placeholder="Official Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
          />

          <input
            name="alternateEmail"
            placeholder="Alternate Email"
            value={form.alternateEmail}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
          />

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
          />

          <h2 className="text-xl font-bold mb-6 border-l-4 pl-2 border-secondary">
            Institutional Info
          </h2>

          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
          />

          <input
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
          />

          <input
            type="date"
            name="dateOfJoining"
            value={form.dateOfJoining}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
          />

          <input
            name="facultyRoles"
            placeholder="Roles (comma-separated)"
            value={form.facultyRoles}
            onChange={handleChange}
            className="w-full p-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
          />

          <h2 className="text-xl font-bold mb-6 border-l-4 pl-2 border-secondary">
            Academic Qualifications
          </h2>

          {form.qualifications.map((qual, i) => (
            <div key={i} className="mb-6 space-y-2">
              <input
                name="degree"
                placeholder="Degree"
                value={qual.degree}
                onChange={(e) => handleQualificationChange(i, e)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
              />

              <input
                name="institution"
                placeholder="Institution"
                value={qual.institution}
                onChange={(e) => handleQualificationChange(i, e)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
              />

              <input
                type="number"
                name="yearOfPassing"
                placeholder="Year of Passing"
                value={qual.yearOfPassing}
                onChange={(e) => handleQualificationChange(i, e)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
              />

              <input
                name="specialization"
                placeholder="Specialization"
                value={qual.specialization}
                onChange={(e) => handleQualificationChange(i, e)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
              />

              <input
                name="gradeOrPercentage"
                placeholder="Grade / Percentage"
                value={qual.gradeOrPercentage}
                onChange={(e) => handleQualificationChange(i, e)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>
          ))}

          <button
            type="button"
            className="text-blue-500 mb-6 cursor-pointer"
            onClick={addQualification}
          >
            + Add another qualification
          </button>

          <h2 className="text-xl font-bold mb-6 border-l-4 pl-2 border-secondary">
            Account Info
          </h2>

          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
          />

          <p className="bg-white p-2 px-4 shadow-md text-gray-500 w-fit h-fit">
            {form.role}
          </p>
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

export default Profile;
