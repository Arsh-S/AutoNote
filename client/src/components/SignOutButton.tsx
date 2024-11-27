import React from "react";
import { signOut } from "../auth/auth";

const SignOutButton = () => {
  const handleSignOut = async () => {
    await signOut();
    console.log("Signed out successfully.");
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOutButton;