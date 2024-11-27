import React from "react";

interface SignOutButtonProps {
  onSignOut: () => void;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ onSignOut }) => {
  return (
    <button onClick={onSignOut} className="signout-button">
      Sign Out
    </button>
  );
};

export default SignOutButton;