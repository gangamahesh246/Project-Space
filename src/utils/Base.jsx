import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const Base = ({ setBase64Path }) => {
  const studentId = useSelector((state) => state.student.user.college_mail);

  useEffect(() => {
    const imageUrl = `https://info.aec.edu.in/ACET/StudentPhotos/${
      studentId.split("@")[0]
    }.jpg`;
    const fetchBase64 = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/image-to-base64?url=${encodeURIComponent(
            imageUrl
          )}`
        );
        const data = await response.json();
        const testImage = new Image();
        testImage.src = data.base64;
        testImage.onload = () => {
          setBase64Path(data.base64); 
        };
      } catch (err) {
        console.error("Error fetching via backend:", err);
      }
    };

    fetchBase64();
  }, [setBase64Path]);

  return null;
};

export default Base;
