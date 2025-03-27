import React from "react";
import Header from "../../components/common/Header/Header";
import "./css/sections.css";
import Hero from "./sections/Hero";
import Featured from "./sections/Featured";
import Divider from "./common/Divider";
import Map from "./sections/Map";

function Home() {
  return (
    <div className="page-container">
      <Header />
      <Hero />
      <Divider />
      <Featured />
      <Map />
    </div>
  );
}

export default Home;
