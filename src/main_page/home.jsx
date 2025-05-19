import React from 'react'
import { motion } from 'framer-motion'
import { useMediaQuery } from 'react-responsive'
import { VscFilePdf } from "react-icons/vsc";
import { IoAccessibility } from "react-icons/io5";
import { MdOutlineSecurity } from "react-icons/md";

const Home = () => {
  const isDesktop = useMediaQuery({ minWidth: 1200 })
  return (
    <div className='sm:w-full h-fit'>
      <section className='sm:h-[80vh] lg:h-[90vh] xl:h-[100vh] bg-primary'>
        <div className='lg:block sm:hidden w-full h-fit'>
        <motion.img
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        src='neon.png' width={350} className='relative left-10 opacity-25' />
        <motion.img 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        src='hot-air.png' className='-rotate-45 absolute top-30 right-30 opacity-25 xl:right-20' width={300} />
        <motion.img 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        src='laptop.png' width={300} height={200} className=' rotate-12 relative -top-15 left-30 opacity-25 xl:left-50' />
        <svg width="100" height="100" className='absolute top-96 left-170 opacity-25 xl:left-200'>
        <motion.circle 
        initial={{ scale: 0.6 }}
        animate={{ scale: 0.9 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        cx="50" cy="50" r="40" fill="none" stroke="skyblue" strokeWidth={2}  />
        </svg>
        <svg width="150" height="150" viewBox="0 0 100 100" className='absolute top-120 left-200 -rotate-45 opacity-25 xl:left-250'>
        <motion.polygon
        initial={{ x: -10 }}
        animate={{ x: 0 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          points="50,15 90,85 10,85"
          fill="none"
          stroke="skyblue"
          strokeWidth={2}
        />
        </svg>
        </div>
        <div className='sm:w-[450px] h-fit md:w-[700px] lg:w-[800px] xl:w-[1200px] absolute top-1/5 left-1/2 -translate-x-1/2'>
           <p className='sm:font_primary text-4xl font-extrabold tracking-wide text-center lg:text-5xl xl:text-7xl pt-10 text-white'>Master Every Exam. Unlock Your Future.</p>
           <p className='sm:font_secondary text-2xl font-extrabold tracking-wide text-center pt-10 capitalize text-secondary lg:text-3xl xl:text-4xl'>secure exam. anywhere. anytime.</p>
           <p className='xl:font_secondary text-xl font-extrabold tracking-wide text-center capitalize pt-5 text-white lg:text-lg'>reliable platform to create, conduct, and monitor online assessments with confidence.</p>
           <button className='w-[150px] h-[50px] text-[20px] font-medium rounded-4xl bg-yellow-300 capitalize mt-10 relative left-1/2 -translate-x-1/2 opacity-80'>get started</button>
        </div>
      </section>
      <section className='sm:w-full h-[163vh] bg-aliceblue'>
        <div className='w-full h-[45vh] bg-primary pt-30 flex justify-center items-center sm:gap-2 md:gap-5'>
          <motion.div 
          initial={{ x: isDesktop ? -50 : 0 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className='sm:w-[150px] sm:h-[350px] md:w-[200px] md:h-[400px] lg:w-[250px] lg:h-[450px] xl:w-[300px] xl:h-[520px] border-3 border-aliceblue rounded-[150px] pl-4'>
            <div className='w-full h-full rounded-[150px] bg-[url(person_1.jpeg)] bg-cover bg-center'></div>
          </motion.div>
          <motion.div 
          initial={{ y: isDesktop ? 50 : 0 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className='sm:w-[150px] sm:h-[350px] md:w-[200px] md:h-[400px] lg:w-[250px] lg:h-[450px] xl:w-[300px] xl:h-[520px] border-3 border-aliceblue rounded-[150px] pt-4 -mt-20'>
            <div className='w-full h-full rounded-[150px] bg-[url(person_2.jpeg)] bg-cover bg-center'></div>
          </motion.div>
          <motion.div 
          initial={{ x: isDesktop ? 50 : 0 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className='sm:w-[150px] sm:h-[350px] md:w-[200px] md:h-[400px] lg:w-[250px] lg:h-[450px] xl:w-[300px] xl:h-[520px] border-3 border-aliceblue rounded-[150px] pr-4'>
            <div className='w-full h-full rounded-[150px] bg-[url(person_3.jpeg)] bg-cover bg-center'></div>
          </motion.div>
        </div>
        <div className='w-full h-[105vh] pt-100 flex flex-col justify-center items-center gap-5'>
          <p className='w-[700px] h-[80px] text-center font_primary text-3xl text-primary font-bold'>Everything you need to create and conduct secure comprehensive exams</p>
          <p className='w-[1000px] h-[80px] text-center font_primary text-xl text-primary'>We simplify all the moving pieces so you can administer your exams securely and with confidence without technical complexity.</p>
          <div className='w-full flex justify-center items-center gap-30'>
            <div className='w-[300px] h-[300px] flex flex-col justify-center items-center gap-5'>
              <VscFilePdf className='text-primary' size={50} />
              <p className='text-primary font_primary text-lg'><strong>Create an exam in minutes</strong> by uploading an existing exam as PDF</p>
            </div>
            <div className='w-[300px] h-[300px] flex flex-col justify-center items-center gap-5'>
              <IoAccessibility className='text-primary' size={50} />
              <p className='text-primary font_primary text-lg'><strong>Empower every student</strong> by customizing exams to each student's individual needs</p>
            </div>
            <div className='w-[300px] h-[300px] flex flex-col justify-center items-center gap-5'>
              <MdOutlineSecurity className='text-primary' size={50} />
              <p className='text-primary font_primary text-lg'><strong>Prevent cheating</strong> with our secure browser lockdown mode</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
