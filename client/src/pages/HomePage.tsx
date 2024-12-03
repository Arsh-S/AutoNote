import React from "react";
import { useAuthUser } from "../auth/AuthUserProvider";
import AuthButton from "../components/AuthButton";
import SignOutButton from "../components/SignOutButton";
import NavigationButtons from "../components/NavigationButtons";
import Header from "../components/Header";

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
            <Header />
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
                        <p>
                            AutoNote is your personal note management tool. Easily upload PDF files, 
                            generate summaries, and preview Markdown notes directly in your browser.
                        </p>
                        <p>
                            <strong>What you can do:</strong>
                        </p>
                        <ul>
                            <li>Upload any PDF file, and AutoNote will process and summarize it to a markdown file.</li>
                            <li>Preview Markdown files directly or download any file.</li>
                            <li>Manage your uploaded notes with renaming and deletion options.</li>
                        </ul>
                        <p>
                            <strong>Supported File Types:</strong> PDF
                        </p>
                        <SignOutButton />
                    </>
                ) : (
                    <>
                        <h1>Welcome to AutoNote</h1>
                        <p>
                            AutoNote is your personal note management tool. Easily upload PDF files, 
                            generate summaries, and preview Markdown notes directly in your browser.
                        </p>
                        <p>
                            <strong>What you can do:</strong>
                        </p>
                        <ul>
                            <li>Upload any PDF file, and AutoNote will process and summarize it to a markdown file.</li>
                            <li>Preview Markdown files directly or download any file.</li>
                            <li>Manage your uploaded notes with renaming and deletion options.</li>
                        </ul>
                        <p>
                            <strong>Supported File Types:</strong> PDF
                        </p>
                        <AuthButton />
                    </>
                )}
            </div>
        </div>
    );
};

export default HomePage;