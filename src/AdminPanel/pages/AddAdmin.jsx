import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const AddAdmin = () => {
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [isOpen, setisOpen] = useState(false);

  const handleAddAdmin = async () => {
    await axiosInstance
      .post("/add-admin", { email })
      .then((res) => {
        setEmployeeId(res.data.admin.employeeId);
        setisOpen(true);
        toast.success("Admin Added Successfully");
      })
      .catch((err) => {
        toast.error("Error Adding Admin");
      });
  };
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {isOpen ? (
        <div className="w-1/2 h-fit bg-white rounded-xl p-10">
          <h1 className="text-2xl text-center font-bold text-amber-500">
            Admin Added Successfully
          </h1>
          <p className="pt-2 text-center font-semibold">Employee ID: {employeeId}</p>
        </div>
      ) : (
        <div className="w-fit h-fit bg-white rounded-xl p-10">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded border-2 border-amber-500 p-2 focus:outline-none"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <button
            onClick={handleAddAdmin}
            className="w-full bg-amber-500 rounded mt-5 p-2 text-white font-bold cursor-pointer"
          >
            Add Admin
          </button>
        </div>
      )}
    </div>
  );
};

export default AddAdmin;
