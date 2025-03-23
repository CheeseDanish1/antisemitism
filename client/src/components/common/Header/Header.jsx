import React, { useState } from "react";
import "./css/style.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="header-container">
      <div className="header-wrap">
        <div className="header-name">
          <h1>Lorem Ipsum</h1>
        </div>

        {/* Mobile menu button */}
        <div className="mobile-menu-button" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation links - shown on desktop or when menu is open on mobile */}
        <div className={`header-places ${isMenuOpen ? "open" : ""}`}>
          <p className="header-element">Report an Incident</p>
          <span className="header-divider" />
          <p className="header-element">Sign the petition</p>
          <span className="header-divider" />
          <p className="header-element">Contact Congress</p>
          <span className="header-divider" />
          <p className="header-element">Get Involved</p>
        </div>
      </div>
    </div>
  );
}

export default Header;
