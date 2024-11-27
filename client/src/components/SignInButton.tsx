import React from "react";
import { signIn } from "../auth/auth";

const AuthButton = () => {
  const handleSignIn = async () => {
    const result = await signIn();
    if (result) {
      console.log("User signed in:", result.user);
    } else {
      console.error("Sign-in failed.");
    }
  };

  return <button onClick={handleSignIn}>Sign In with Google</button>;
};

export default AuthButton;