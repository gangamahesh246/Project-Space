import React from "react";
import { useMediaQuery } from 'react-responsive'
import { motion } from 'framer-motion'
import { VscFilePdf } from "react-icons/vsc";
import { IoAccessibility } from "react-icons/io5";
import { MdOutlineSecurity } from "react-icons/md";

const Second_Section = () => {
  const isDesktop = useMediaQuery({ minWidth: 1200 })
  return (
    <section className="sm:w-full xl:h-[163vh] bg-aliceblue">
      <div className="w-full h-[45vh] bg-primary pt-30 flex justify-center items-center sm:gap-2 md:gap-5 ">
        <motion.div
          initial={{ x: isDesktop ? -50 : 0 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="sm:w-[150px] sm:h-[350px] md:w-[200px] md:h-[400px] lg:w-[250px] lg:h-[450px] xl:w-[300px] xl:h-[520px] border-3 border-aliceblue rounded-[150px] pl-4"
        >
          <div className="w-full h-full rounded-[150px] bg-[url(person_1.jpeg)] bg-cover bg-center"></div>
        </motion.div>
        <motion.div
          initial={{ y: isDesktop ? 50 : 0 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="sm:w-[150px] sm:h-[350px] md:w-[200px] md:h-[400px] lg:w-[250px] lg:h-[450px] xl:w-[300px] xl:h-[520px] border-3 border-aliceblue rounded-[150px] pt-4 -mt-20"
        >
          <div className="w-full h-full rounded-[150px] bg-[url(person_2.jpeg)] bg-cover bg-center"></div>
        </motion.div>
        <motion.div
          initial={{ x: isDesktop ? 50 : 0 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="sm:w-[150px] sm:h-[350px] md:w-[200px] md:h-[400px] lg:w-[250px] lg:h-[450px] xl:w-[300px] xl:h-[520px] border-3 border-aliceblue rounded-[150px] pr-4"
        >
          <div className="w-full h-full rounded-[150px] bg-[url(person_3.jpeg)] bg-cover bg-center"></div>
        </motion.div>
      </div>
      <div className="xl:w-full xl:h-[100vh] sm:pt-40 lg:pt-60 flex flex-col items-center gap-5 sm:overflow-hidden">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="sm:w-[350px] sm:h-[50px] md:w-[450px] md:h-[70px] lg:w-[550px] lg:h-[80px] lg:text-2xl xl:w-[700px] text-center font_primary xl:text-4xl text-[#AB444C] font-bold"
        >
          Everything you need to create and conduct secure comprehensive exams
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="xl:w-[1000px] xl:h-[80px] md:w-[700px] lg:w-[900px] lg:text-lg text-center font_primary xl:text-xl text-primary"
        >
          We simplify all the moving pieces so you can administer your exams
          securely and with confidence without technical complexity.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="w-full sm:flex sm:flex-col md:flex md:flex-row md:justify-center md:items-center sm:items-center lg:gap-20 xl:gap-30"
        >
          <div className="sm:w-[270px] sm:h-[250px] md:pl-3 xl:w-[300px] xl:h-[300px] flex flex-col justify-center items-center gap-5">
            <VscFilePdf className="text-primary" size={50} />
            <p className="text-primary font_primary sm:text-lg xl:text-xl">
              <strong>Create an exam in minutes</strong> by uploading an
              existing exam as PDF
            </p>
          </div>
          <div className="sm:w-[270px] sm:h-[250px] xl:w-[300px] xl:h-[300px] flex flex-col justify-center items-center gap-5">
            <IoAccessibility className="text-primary" size={50} />
            <p className="text-primary font_primary sm:text-lg xl:text-xl">
              <strong>Empower every student</strong> by customizing exams to
              each student's individual needs
            </p>
          </div>
          <div className="sm:w-[270px] sm:h-[250px] md:pr-3 xl:w-[300px] xl:h-[300px] flex flex-col justify-center items-center gap-5">
            <MdOutlineSecurity className="text-primary" size={50} />
            <p className="text-primary font_primary sm:text-lg xl:text-xl">
              <strong>Prevent cheating</strong> with our secure browser lockdown
              mode
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Second_Section;
