import React, { useState } from "react";
import Header from "../../components/common/Header/Header";
import useColleges from "../../hooks/useColleges";
import CollegeInfo from "./components/CollegeInfo";
import SearchBar from "./components/SearchBar";
import SortControls from "./components/SortControls";
import StatsSummary from "./components/StatsSummary";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import "./css/Colleges.css";

function Colleges() {
  const { colleges, loading } = useColleges();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState("incidents");
  const [sortDirection, setSortDirection] = useState("desc");

  if (loading) {
    return <LoadingSpinner message="Loading colleges data..." />;
  }

  // Filter colleges based on search query
  const filteredColleges = colleges.filter(
    (college) =>
      college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort colleges based on criteria
  const sortedColleges = [...filteredColleges].sort((a, b) => {
    let comparison = 0;

    if (sortCriteria === "incidents") {
      comparison = a.incidents - b.incidents;
    } else if (sortCriteria === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortCriteria === "ranking") {
      comparison = a.ranking - b.ranking;
    }

    return sortDirection === "desc" ? -comparison : comparison;
  });

  return (
    <div className="page-container">
      <Header />

      <div className="colleges-container">
        <div className="page-header">
          <h1 className="page-title">College Antisemitism Tracker</h1>
          <p className="page-description">
            Monitoring and documenting antisemitic incidents across U.S. college
            campuses. Search for a specific institution or browse the database
            below.
          </p>
        </div>

        <div className="search-and-filter">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <SortControls
            sortCriteria={sortCriteria}
            setSortCriteria={setSortCriteria}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />
        </div>

        <StatsSummary
          collegesCount={colleges.length}
          totalIncidents={colleges.reduce(
            (sum, college) => sum + college.incidents,
            0
          )}
        />

        <div className="results-info">
          <p>
            Showing {sortedColleges.length} of {colleges.length} colleges
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        <div className="colleges-grid">
          {sortedColleges.length > 0 ? (
            sortedColleges.map((college, i) => (
              <CollegeInfo college={college} key={i} />
            ))
          ) : (
            <div className="no-results">
              <p>
                No colleges match your search criteria. Please try a different
                search term.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Colleges;
