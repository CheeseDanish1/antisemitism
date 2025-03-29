import React from "react";
import "../css/hero.css";

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-message">
          <h1 className="hero-title">
            Tracking Antisemitism on{" "}
            <span className="hero-text-emphasis">
              America's College Campuses
            </span>
          </h1>
          <p className="hero-description">
            We are committed to tracking, recording, and raising awareness about
            antisemitic incidents across university campuses nationwide. Through
            data collection and community engagement, we ensure these incidents
            are documented and addressed to promote a safer academic environment
            for Jewish students.
          </p>
        </div>

        <div className="hero-petition-container">
          <div className="hero-petition-content-top">
            <h1 className="hero-petition-number">1,351</h1>
            <h2 className="hero-petition-top-text">Have Taken a Stand</h2>
            <div className="hero-petition-bar-container">
              <div className="hero-petition-bar-unfinished">
                <div className="hero-petition-bar-finished" />
              </div>
              <div className="hero-petition-bar-bottom">
                <p className="petition-progress">1351/1500</p>
                <p className="petition-percentage">90% to Goal</p>
              </div>
            </div>
          </div>
          <div className="hero-petition-content-bottom">
            <p className="petition-cta-text">
              Join others in standing against antisemitism on campus
            </p>
            <button className="hero-petition-button">
              <span>Join Us Today</span>
            </button>
          </div>
        </div>
      </div>

      <div className="hero-stats">
        <div className="stat-item">
          <span className="stat-number">247</span>
          <span className="stat-label">Incidents Reported</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">83</span>
          <span className="stat-label">Campuses Affected</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">31</span>
          <span className="stat-label">States Impacted</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
