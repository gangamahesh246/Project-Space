import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { GoPlus } from "react-icons/go";

const ExamPage = ({ onCreateExam }) => {
  const navigate = useNavigate()
  const [status, setStatus] = useState("all status");
  const [exam, setExam] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/getexam')
    .then((res) => {
      setExam(res.data)
      console.log(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  const handleChange = (e) => {
    setStatus(e.target.value);
  };
  return (
    <div className='w-full h-full bg-aliceblue flex gap-5 overflow-y-auto hide-scrollbar'>
      <div className='w-full h-full'>
        <div className='w-full h-16 bg-white border-b-1 border-gray-300 shadow-lg flex items-center justify-between px-4'>
          <button className='bg-green-500 p-2 rounded-lg flex items-center gap-1 cursor-pointer text-aliceblue' onClick={onCreateExam}><GoPlus size={20} /> New exam</button>
          <div className='flex items-center gap-2'>
            <input type="text" className='border border-gray-300 rounded-lg p-2' placeholder='Search' />
            <select className='border border-gray-300 text-green-500 rounded-lg p-2' value={status} onChange={handleChange}>
              <option value="all status">All status</option>
              <option value="completed">Completed</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>
        {
          exam?.map((item, i) => {
            return (
              <div key={i} className='w-full h-20 bg-white shadow-lg '>
                <img src={`http://localhost:3000${item.basicInfo.coverPreview}`} alt="Cover" className="w-20 h-20 object-cover rounded" />
              </div>
            )
          })
        }
      </div>
      
    </div>
  )
}

export default ExamPage
