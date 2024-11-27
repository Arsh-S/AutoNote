import React, { useState } from "react";
import Navigation from "../components/Navigation";

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64File = reader.result?.toString().split(",")[1];
      const token = "YOUR_FIREBASE_ID_TOKEN"; // Replace with actual token
      try {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fileName: file.name, fileData: base64File }),
        });
        const data = await response.json();
        if (response.ok) {
          setMessage(`Uploaded successfully: ${data.url}`);
        } else {
          setMessage(`Error: ${data.error}`);
        }
      } catch (error) {
        setMessage("Failed to upload the file.");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container">
      <h2>Upload Notes</h2>
      <label className="file-input-label">
        Choose File
        <input
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </label>
      <button onClick={handleUpload}>Upload</button>
      {message && <p className="message">{message}</p>}
      <Navigation isLoggedIn={true} />
    </div>
  );
};

export default UploadPage;