import React from "react";
import { AlertTriangle, MapPin, Globe, Info } from "lucide-react";
import config from "../../../config/api";
import "../css/CollegeInfo.css";

function CollegeInfo({ college }) {
  return (
    <div className="college-info">
      <div className="college-info-badge">
        <AlertTriangle size={16} />
        {college.incidents} Incidents
      </div>

      <div
        className="college-photo"
        style={{
          backgroundImage: `url(${config.API_URI + college.banner_path})`,
        }}
      ></div>

      <div className="college-content">
        <h2 className="college-name">{college.name}</h2>

        <div className="college-details">
          <div className="college-location">
            <MapPin size={16} />
            <span>{college.location}</span>
          </div>
        </div>

        <p className="college-description">{college.description}</p>

        <div className="college-footer">
          <a
            href={college.website}
            target="_blank"
            rel="noopener noreferrer"
            className="college-website"
          >
            <Globe size={16} />
            Visit Website
          </a>

          <button className="college-details-btn">
            <Info size={16} />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default CollegeInfo;
