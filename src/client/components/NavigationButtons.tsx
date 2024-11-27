import React from "react";
import { Link } from "react-router-dom";

const NavigationButtons: React.FC = () => {
  return (
    <div style={navContainerStyle}>
      <Link to="/">
        <button style={buttonStyle}>Home</button>
      </Link>
      <Link to="/upload">
        <button style={buttonStyle}>Upload Notes</button>
      </Link>
      <Link to="/view-notes">
        <button style={buttonStyle}>View Notes</button>
      </Link>
    </div>
  );
};

const navContainerStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginTop: "20px",
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "#fff",
  transition: "background-color 0.3s",
};

export default NavigationButtons;