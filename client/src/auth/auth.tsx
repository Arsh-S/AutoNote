import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../utils/firebase";

const provider = new GoogleAuthProvider();

export const signIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;

        // Call logToken after a user signs in.
        logToken();
        return { user, token };
    } catch (error: any) {
        console.error(`Error during sign-in. Code: ${error.code}, Message: ${error.message}`);
        return null;
    }
};

export const signOut = async () => {
    try {
        await firebaseSignOut(auth);
        console.log("User signed out successfully.");
    } catch (error: any) {
        console.error(`Error during sign-out. Code: ${error.code}, Message: ${error.message}`);
    }
};

export const logToken = async () => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        // console.log("Firebase ID Token:", token);
        return token;
    } else {
        console.error("No user is signed in!");
        return null;
    }
};
