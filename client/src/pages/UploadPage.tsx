import React, { useState } from "react";
import NavigationButtons from "../components/NavigationButtons";
import { useAuthUser } from "../auth/AuthUserProvider";

const UploadPage = () => {
  const { user, loading } = useAuthUser();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          setMessage("File uploaded successfully!");
          setFile(null);
        } else {
          setMessage("Failed to upload file.");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setMessage("Error uploading file.");
      }
    } else {
      setMessage("Please select a file to upload.");
    }
  };

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
        <h1>Upload Notes</h1>
        {!user ? (
          <p>You must be signed in to upload notes.</p>
        ) : (
          <>
            <form>
              <label htmlFor="file-upload">Choose a file:</label>
              <input
                type="file"
                id="file-upload"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <button type="button" onClick={handleUpload}>
                Upload
              </button>
            </form>
            {message && <p>{message}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default UploadPage;