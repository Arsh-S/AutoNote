import React from "react";
import { Link } from "react-router-dom";

const Navigation: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => (
  <nav>
    <Link to="/">
      <button>Home</button>
    </Link>
    {isLoggedIn && (
      <>
        <Link to="/upload">
          <button>Upload Notes</button>
        </Link>
        <Link to="/view-notes">
          <button>View Notes</button>
        </Link>
      </>
    )}
  </nav>
);

export default Navigation;