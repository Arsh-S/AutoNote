import React, { useState } from "react";
import Navigation from "../components/Navigation";
import AuthButton from "../components/AuthButton";

const HomePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignIn = () => {
    console.log("User signed in");
    setIsLoggedIn(true);
  };

  const handleSignOut = () => {
    console.log("User signed out");
    setIsLoggedIn(false);
  };

  return (
    <div className="container">
      <h2>Welcome to the Notes App</h2>
      <p>
        This application allows you to upload, view, and manage your notes securely. 
        Use the navigation buttons to get started.
      </p>
      <AuthButton isLoggedIn={isLoggedIn} onSignIn={handleSignIn} onSignOut={handleSignOut} />
      <Navigation isLoggedIn={isLoggedIn} />
    </div>
  );
};

export default HomePage;