import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axiosStudent from '../../utils/axiosStudent';
import { Award } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

const RankByExam = () => {
    const location = useLocation();
    const { examId } = location.state;
    const college_mail = useSelector((state) => state.student.user.college_mail);

    const [data, setData] = useState([])

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_Base_URL}/getLeaderBoardbyexam`, {
            params: {
                examId: examId
            }
        }).then((res) => {
            setData(res.data)
        }).catch((err) => {
            toast.info("No Data Found")
        })
    }, [examId]);

  return (
    <div className='w-full h-full bg-gray-100 p-3'>
    <div className="bg-white rounded shadow p-4 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-amber-500 font-semibold text-sm">
            <th className="py-2 px-1">#</th>
            <th className="py-2 px-1">Student Mail</th>
            <th className="py-2 px-1">Score</th>
            <th className="py-2 px-1">Correct</th>
            <th className="py-2 px-1">Incorrect</th>
            <th className="py-2 px-1">Violations</th>
            <th className="py-2 px-1">Total Marks</th>
            <th className="py-2 px-1 flex items-center gap-1">
              Rank <Award className="w-4 h-4 text-yellow-500" />
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((entry, index) => (
            <tr
              key={entry._id}
              className={`border-b border-gray-200 text-sm ${
                entry.student_mail === college_mail
                  ? "font-semibold bg-amber-50 text-amber-500"
                  : "hover:bg-gray-50"
              }`}
            >
              <td className="py-2 px-1">{index + 1}</td>
              <td className="py-2 px-1">{entry.student_mail}</td>
              <td className="py-2 px-1">{entry.score}</td>
              <td className="py-2 px-1">{entry.correct}</td>
              <td className="py-2 px-1">{entry.incorrect}</td>
              <td className="py-2 px-1">{entry.violations}</td>
              <td className="py-2 px-1">{entry.totalMarks}</td>
              <td className="py-2 px-1">{index + 1}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}

export default RankByExam
