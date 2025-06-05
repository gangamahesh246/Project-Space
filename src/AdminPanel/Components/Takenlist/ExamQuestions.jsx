import React from 'react'
import { useParams } from 'react-router-dom';


const ExamQuestions = () => {
  const { examId } = useParams();
  console.log(examId);
  return (
    <div className='w-full h-full bg-white'>
      
    </div>
  )
}

export default ExamQuestions;
