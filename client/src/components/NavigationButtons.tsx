import React from "react";
import { Link } from "react-router-dom";

const NavigationButtons = () => (
  <nav>
    <Link to="/">Home</Link>
    <Link to="/upload">Upload Notes</Link>
    <Link to="/view">View Notes</Link>
  </nav>
);

export default NavigationButtons;