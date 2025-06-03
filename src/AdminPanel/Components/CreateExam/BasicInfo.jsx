import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setBasic } from "../../../slices/ExamSlice";

const BasicInfo = ({ setActiveTab, setCoverFile }) => {
  const dispatch = useDispatch();

  const [basicInfo, setBasicInfo] = useState({
    title: "",
    category: "",
    cover: null,
    coverPreview: "/exam.jpg",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo({ ...basicInfo, [name]: value });
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setBasicInfo({
        ...basicInfo,
        cover: file,
        coverPreview: previewURL,
      });
    }
  };

  return (
    <div className="w-full h-fit bg-aliceblue sm:p-3 xl:p-10">
      <div className="sm:w-78 sm:p-5 md:w-145 xl:w-4/5 h-fit xl:mx-auto bg-white shadow-lg rounded-lg xl:p-8 ">
        <form>
          <label className="block mb-6 text-md font-semibold border-l-4 border-secondary pl-2">
            Exam Title
          </label>
          <input
            type="text"
            name="title"
            value={basicInfo.title}
            required
            className="capitalize w-full p-2 mb-6 ml-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
            placeholder="Enter exam title"
            onChange={handleInputChange}
          />
          <label className="block mb-6 text-md font-semibold border-l-4 border-secondary pl-2">
            Exam Category
          </label>
          <input
            type="text"
            name="category"
            value={basicInfo.category}
            required
            className="capitalize w-full p-2 mb-6 ml-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
            placeholder="Enter Exam Category"
            onChange={handleInputChange}
          />
          <label className="block mb-6 text-md font-semibold border-l-4 border-secondary pl-2">
            Exam Cover
          </label>
          <div
            className="w-50 h-50 rounded-lg mb-6 ml-2 flex justify-center items-center cursor-pointer"
            style={{
              backgroundImage: `url(${basicInfo.coverPreview})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <input
              type="file"
              name="cover"
              onChange={handleCoverChange}
              className="w-1/2 h-fit font_primary border-2 border-primary p-2 rounded-md"
              accept="image/*"
            />
          </div>
          <label className="block mb-6 text-md font-semibold border-l-4 border-secondary pl-2">
            Description
          </label>
          <textarea
            name="description"
            value={basicInfo.description}
            className="capitalize w-full h-fit p-2 mb-6 ml-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
            placeholder="click for more info"
            onChange={handleInputChange}
          />
        </form>
        <div className="flex justify-end">
          <button
            className="text-white px-4 py-2 rounded-lg bg-green-500 cursor-pointer "
            onClick={() => {
              if (!basicInfo.title || !basicInfo.category) {
                alert("Please fill in all fields.");
                return;
              }

              const { title, category, description, cover } = basicInfo;
              dispatch(setBasic({ title, category, description }));

              setCoverFile(cover);

              setBasicInfo({
                title: "",
                category: "",
                cover: null,
                coverPreview: "/exam.jpg",
                description: "",
              });
              setActiveTab("addQuestions");
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
