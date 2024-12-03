import React, { useState } from "react";
import NavigationButtons from "../components/NavigationButtons";
import { useAuthUser } from "../auth/AuthUserProvider";

const UploadPage = () => {
  const { user } = useAuthUser();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const idToken = await user?.getIdToken();
      if (!idToken) {
        setMessage("Authentication failed. Please sign in again.");
        setLoading(false);
        return;
      }
      const fileData = await fileToBase64(file);
      const response = await fetch("http://localhost:5174/api/notes/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileData: fileData.split(",")[1], // Remove metadata prefix from base64 string
        }),
      });

      if (response.ok) {
        setMessage("File uploaded successfully!");
      } else {
        const data = await response.json();
        setMessage(`Upload failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("An error occurred during the upload.");
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="centered-container">
      <div className="container center-content">
        <NavigationButtons />
        <h1>Upload Notes</h1>
        {!user ? (
          <p>You must be signed in to upload notes.</p>
        ) : (
          <>
            <form className="upload-form">
              <label htmlFor="file-upload">Choose a file:</label>
              <input
                type="file"
                id="file-upload"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <button
                type="button"
                onClick={handleUpload}
                disabled={loading}
                className={loading ? "loading-btn" : ""}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </form>
            {message && <p className="upload-message">{message}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default UploadPage;