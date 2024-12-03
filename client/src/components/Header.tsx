import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <Link to="/">
        <div className="logo-container">
          <img
            src="/autonote.svg"
            alt="AutoNote Logo"
            className="logo"
          />
          <h1 className="app-title">AutoNote</h1>
        </div>
          </Link>
          
    </header>
    
  );
};

export default Header;