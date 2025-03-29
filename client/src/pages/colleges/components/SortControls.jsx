import React from "react";
import "../css/SortControls.css";

function SortControls({
  sortCriteria,
  setSortCriteria,
  sortDirection,
  setSortDirection,
}) {
  return (
    <div className="filter-options">
      <label className="filter-label">Sort by:</label>
      <select
        value={sortCriteria}
        onChange={(e) => setSortCriteria(e.target.value)}
        className="sort-select"
      >
        <option value="incidents">Incidents</option>
        <option value="name">College Name</option>
        <option value="ranking">Ranking</option>
      </select>

      <button
        onClick={() =>
          setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        }
        className="sort-direction-btn"
      >
        {sortDirection === "asc" ? "↑ Ascending" : "↓ Descending"}
      </button>
    </div>
  );
}

export default SortControls;
