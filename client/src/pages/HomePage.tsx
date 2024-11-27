import React from "react";
import { useAuthUser } from "../auth/AuthUserProvider";
import AuthButton from "../components/AuthButton";
import SignOutButton from "../components/SignOutButton";
import NavigationButtons from "../components/NavigationButtons";

const HomePage = () => {
  const { user, loading } = useAuthUser();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="centered-container">
      <div className="container center-content">
        <NavigationButtons />
        <h1>Welcome to AutoNote</h1>
        {user ? (
          <>
            <p>Logged in as {user.displayName}</p>
            <SignOutButton />
          </>
        ) : (
          <AuthButton />
        )}
      </div>
    </div>
  );
};

export default HomePage;