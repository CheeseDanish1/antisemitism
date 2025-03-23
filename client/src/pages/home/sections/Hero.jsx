import React from "react";
import "../css/hero.css";

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-petition-container">
          <div className="hero-petition-content-top">
            <h1 className="hero-petition-number">1,351</h1>
            <h1 className="hero-petition-top-text">Have Taken a Stand</h1>
            <div className="hero-petition-bar-container">
              <div className="hero-petition-bar-unfinished">
                <div className="hero-petition-bar-finished" />
              </div>
              <div className="hero-petition-bar-bottom">
                <p>1341/1500</p>
                <p>90% to Goal</p>
              </div>
            </div>
          </div>
          <div className="hero-petition-content-bottom">
            <button className="hero-petition-button">
              <span>Join Us Today</span>
            </button>
          </div>
        </div>
        <div className="hero-text-right">
          <h1>
            Antisemitism has been{" "}
            <span className="hero-text-emphasis">rising</span> on <br />{" "}
            America's college campuses
          </h1>
        </div>
      </div>
    </section>
  );
}

export default Hero;
