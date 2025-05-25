import React from 'react'
import { motion } from 'framer-motion'
import { useMediaQuery } from 'react-responsive'
import { VscFilePdf } from "react-icons/vsc";
import { IoAccessibility } from "react-icons/io5";
import { MdOutlineSecurity } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { BsYoutube } from "react-icons/bs";
import { FaTwitter } from "react-icons/fa";
import FlowChart from './flow_chart';

const Home = () => {
  const isDesktop = useMediaQuery({ minWidth: 1200 })
  return (
    <div className='sm:w-full h-fit'>
      <section className='sm:h-[80vh] xl:h-[100vh] bg-primary'>
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
      <section className='sm:w-full xl:h-[163vh] bg-aliceblue'>
        <div className='w-full h-[45vh] bg-primary pt-30 flex justify-center items-center sm:gap-2 md:gap-5 '>
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
        <div className='xl:w-full xl:h-[100vh] sm:pt-40 lg:pt-60 flex flex-col items-center gap-5 sm:overflow-hidden'>
          <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className='sm:w-[350px] sm:h-[50px] md:w-[450px] md:h-[70px] lg:w-[550px] lg:h-[80px] lg:text-2xl xl:w-[700px] text-center font_primary xl:text-4xl text-[#AB444C] font-bold'>Everything you need to create and conduct secure comprehensive exams</motion.p>
          <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className='xl:w-[1000px] xl:h-[80px] md:w-[700px] lg:w-[900px] lg:text-lg text-center font_primary xl:text-xl text-primary'>We simplify all the moving pieces so you can administer your exams securely and with confidence without technical complexity.</motion.p>
          <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className='w-full sm:flex sm:flex-col md:flex md:flex-row md:justify-center md:items-center sm:items-center lg:gap-20 xl:gap-30'>
            <div className='sm:w-[270px] sm:h-[250px] md:pl-3 xl:w-[300px] xl:h-[300px] flex flex-col justify-center items-center gap-5'>
              <VscFilePdf className='text-primary' size={50} />
              <p className='text-primary font_primary sm:text-lg xl:text-xl'><strong>Create an exam in minutes</strong> by uploading an existing exam as PDF</p>
            </div>
            <div className='sm:w-[270px] sm:h-[250px] xl:w-[300px] xl:h-[300px] flex flex-col justify-center items-center gap-5'>
              <IoAccessibility className='text-primary' size={50} />
              <p className='text-primary font_primary sm:text-lg xl:text-xl'><strong>Empower every student</strong> by customizing exams to each student's individual needs</p>
            </div>
            <div className='sm:w-[270px] sm:h-[250px] md:pr-3 xl:w-[300px] xl:h-[300px] flex flex-col justify-center items-center gap-5'>
              <MdOutlineSecurity className='text-primary' size={50} />
              <p className='text-primary font_primary sm:text-lg xl:text-xl'><strong>Prevent cheating</strong> with our secure browser lockdown mode</p>
            </div>
          </motion.div>
        </div>
      </section>
      <section className='w-full h-fit'>
        <FlowChart />
      </section>
      <footer className='sm:w-full xl:h-[75vh] bg-primary text-center xl:p-7 sm:flex sm:flex-col sm:justify-center sm:items-center'>
        <div className='sm:w-full sm:h-fit lg:h-5/6 border-b-[1px] border-[#a4bfce] sm:flex sm:flex-col xl:flex-row sm:justify-center sm:items-center gap-5'>
          <div className='sm:w-fit xl:w-1/2 h-full text-left p-10'>
             <p className='text-[#a4bfce] font_primary text-3xl font-extrabold'>Live Monitoring Enabled</p>          
             <p className='text-[#a4bfce] font_primary text-xl font-bold mx-10 mb-5'>- Your test activity may be recorded for academic integrity.</p>     
              <p className='w-5/6 text-[#a4bfce] font_primary text-xl font-bold'>AI-Powered Proctoring | Anomalies are automatically flagged and reviewed.</p>       
              <div className='w-full h-1/3 flex justify-center items-center gap-5 mt-5'>
                  <FaGithub size={30} color='white'/>
                  <FaFacebook size={30} color='white' />
                  <BsYoutube size={30} color='white'/>
                  <FaTwitter size={30} color='white' />
              </div>          
          </div>        
          <div className='lg:w-1/2 lg:h-full lg:flex lg:justify-center lg:items-center'>
            <div className='lg:w-5/6 lg:h-full bg-[url("/monitor.png")] bg-no-repeat bg-center bg-cover filter invert'></div>          
          </div>        
        </div>
        <div className='w-5/6 h-fit flex justify-between items-center mt-5'>
          <p className='text-[#a4bfce] font_primary sm:text-sm xl:text-lg'>© 2023 Copyright | All Rights Reserved</p>
          <div className='flex justify-center items-center sm:gap-5 xl:gap-10 '>
            <p className='text-[#a4bfce] font_primary sm:text-[10px] xl:text-lg'>Terms & Conditions</p>
            <p className='text-[#a4bfce] font_primary sm:text-[10px] xl:text-lg'>Privacy Policy</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home;
