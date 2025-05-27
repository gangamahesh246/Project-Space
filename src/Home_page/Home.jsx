import React from "react";
import NavBar from "./NavBar";
import Header from "./sections/Header";
import Second_Section from "./sections/Second_Section";
import FlowChart from "./sections/flow_chart";
import Footer from "./sections/Footer";

const Home = () => {
  return (
    <div className="sm:w-full h-fit">
      <NavBar />
      <Header />
      <Second_Section />
      <FlowChart />
      <Footer />
    </div>
  );
};

export default Home;
