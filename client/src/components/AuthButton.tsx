import React from "react";
import { signIn } from "../auth/auth";

const AuthButton = () => {
  const handleSignIn = async () => {
    const result = await signIn();
    if (result) {
      console.log("Signed in successfully:", result.user);
    } else {
      console.error("Sign-in failed.");
    }
  };

  return <button onClick={handleSignIn}>Sign In with Google</button>;
};

export default AuthButton;