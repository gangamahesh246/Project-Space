import React from 'react'
import { useSelector } from 'react-redux'

const StudentExamPage = () => {
  const {assignedExam} = useSelector((state) => state)
  console.log(assignedExam)
  return (
    <div className='w-full h-screen bg-red-300'>
      
    </div>
  )
}

export default StudentExamPage
