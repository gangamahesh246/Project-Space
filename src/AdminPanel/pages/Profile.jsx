import axios from "axios";
import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Profile = () => {
  const [showPassword, setShowPassword] = useState(false);
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
    password: "",
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
  const [originalForm, setOriginalForm] = useState(initialForm);
  const [isProfileExists, setIsProfileExists] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/getprofile", {
        params: { employeeId: "EMP123456" },
      })
      .then((response) => {
        setOriginalForm(JSON.parse(JSON.stringify(response.data)));
        setForm(response.data);
        setIsProfileExists(true);
      })
      .catch((error) => {
        console.log("Profile not found:", error.message);
        setForm({ ...initialForm, employeeId: "EMP123456" });
        setOriginalForm({ ...initialForm, employeeId: "EMP123456" });
        setIsProfileExists(false);
      });
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
    const url = isProfileExists
      ? "http://localhost:3000/createprofile"
      : "http://localhost:3000/updateprofile";

    const method = isProfileExists ? "post" : "put";

    try {
      const res = await axios[method](url, form);
      alert(
        isProfileExists
          ? "Profile updated successfully!"
          : "Profile created successfully!"
      );
      setOriginalForm(JSON.parse(JSON.stringify(form)));
      setIsProfileExists(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const isModified = JSON.stringify(form) !== JSON.stringify(originalForm);

  return (
    <div className="w-full h-fit bg-aliceblue sm:p-3 xl:p-10 flex justify-center items-center">
      <div className="sm:w-78 sm:p-5 md:w-145 xl:w-4/5 h-fit xl:mx-auto bg-white shadow-lg rounded-lg xl:p-8">
        <form>
          <div
            className="w-50 h-50 rounded-lg border-2 border-green-500 mb-6 ml-2 flex justify-center items-center cursor-pointer"
            style={{
              backgroundImage: `url(${PreviewImage || form.photo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <label
              htmlFor="fileInput"
              className="border border-green-500 text-green-500 rounded-md font-semibold py-2 px-4 cursor-pointer text-center"
            >
              <span>{file ? file.name : "Upload file"}</span>
            </label>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={handleCoverChange}
            />
          </div>
          <h2 className="text-xl font-bold mb-6 border-l-4 pl-2 border-secondary">
            Personal Information
          </h2>

          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
          />

          <input
            name="employeeId"
            placeholder="Employee ID"
            value={form.employeeId}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
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
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
          />

          <input
            name="contactNumber"
            placeholder="Contact Number"
            value={form.contactNumber}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
          />

          <input
            name="email"
            placeholder="Official Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
          />

          <input
            name="alternateEmail"
            placeholder="Alternate Email"
            value={form.alternateEmail}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
          />

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-2 mb-6 border border-gray-300 rounded-lg"
          />

          <h2 className="text-xl font-bold mb-6 border-l-4 pl-2 border-secondary">
            Institutional Info
          </h2>

          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
          />

          <input
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
          />

          <input
            type="date"
            name="dateOfJoining"
            value={form.dateOfJoining}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
          />

          <input
            name="facultyRoles"
            placeholder="Roles (comma-separated)"
            value={form.facultyRoles}
            onChange={handleChange}
            className="w-full p-2 mb-6 border border-gray-300 rounded-lg"
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
                className="w-full p-2 border border-gray-300 rounded-lg"
              />

              <input
                name="institution"
                placeholder="Institution"
                value={qual.institution}
                onChange={(e) => handleQualificationChange(i, e)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />

              <input
                type="number"
                name="yearOfPassing"
                placeholder="Year of Passing"
                value={qual.yearOfPassing}
                onChange={(e) => handleQualificationChange(i, e)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />

              <input
                name="specialization"
                placeholder="Specialization"
                value={qual.specialization}
                onChange={(e) => handleQualificationChange(i, e)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />

              <input
                name="gradeOrPercentage"
                placeholder="Grade / Percentage"
                value={qual.gradeOrPercentage}
                onChange={(e) => handleQualificationChange(i, e)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          ))}

          <button
            type="button"
            className="text-blue-500 mb-6"
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
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg pr-10"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <p>Admin</p>
        </form>

        <div className="flex justify-end">
          <div className="flex justify-end mt-6">
            {!isProfileExists ? (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Create 
              </button>
            ) : isModified ? (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-green-500 text-white"
              >
                Update
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
