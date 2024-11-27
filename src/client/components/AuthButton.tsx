import React from "react";

interface AuthButtonProps {
  isLoggedIn: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ isLoggedIn, onSignIn, onSignOut }) => {
  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      {isLoggedIn ? (
        <button onClick={onSignOut} className="auth-button">
          Sign Out
        </button>
      ) : (
        <button onClick={onSignIn} className="auth-button">
          Sign In
        </button>
      )}
    </div>
  );
};

export default AuthButton;