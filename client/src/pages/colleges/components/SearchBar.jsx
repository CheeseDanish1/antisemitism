import React from "react";
import { Search } from "lucide-react";
import "../css/SearchBar.css";

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by college name or location..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <Search className="search-icon" size={20} />
    </div>
  );
}

export default SearchBar;
