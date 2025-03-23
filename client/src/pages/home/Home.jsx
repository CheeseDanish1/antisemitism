import React from "react";
import Header from "../../components/common/Header/Header";
import "./css/sections.css";
import Hero from "./sections/Hero";
import Test from "./sections/Test";

function Home() {
  return (
    <div className="page-container">
      <Header />
      <Hero />
      <Test />
    </div>
  );
}

export default Home;
