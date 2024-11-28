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
            <header className="header">
                <img src="/autonote.svg" alt="AutoNote" className="logo" />
                <h1 className="app-title">AutoNote</h1>
            </header>
            <div className="container center-content">
                <NavigationButtons />
                {user ? (
                    <>
                        <h1>Welcome, {user.displayName?.split(" ")[0]}!</h1>
                        {user.photoURL && (
                            <img
                                src={user.photoURL}
                                alt="Profile"
                                className="profile-img"
                                referrerPolicy="no-referrer"
                            />
                        )}
                        <SignOutButton />
                    </>
                ) : (
                    <>
                        <h1>Welcome to AutoNote</h1>
                        <AuthButton />
                    </>
                )}
            </div>
        </div>
    );
};

export default HomePage;
