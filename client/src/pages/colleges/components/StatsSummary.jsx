import React from "react";
import "../css/StatsSummary.css";

function StatsSummary({ collegesCount, totalIncidents }) {
  return (
    <div className="stats-summary">
      <div className="stat-item">
        <h3 className="stat-value">{collegesCount}</h3>
        <p className="stat-label">Colleges Tracked</p>
      </div>
      <div className="stat-item">
        <h3 className="stat-value">{totalIncidents}</h3>
        <p className="stat-label">Total Incidents</p>
      </div>
      <div className="stat-item">
        {/* TODO Have this be most recently last updated incident */}
        <h3 className="stat-value">{new Date().toLocaleDateString()}</h3>
        <p className="stat-label">Last Updated</p>
      </div>
    </div>
  );
}

export default StatsSummary;
