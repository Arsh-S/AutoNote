import React, { useState } from "react";
import NavigationButtons from "../components/NavigationButtons";
import Header from "../components/Header";
import { useAuthUser } from "../auth/AuthUserProvider";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = "node_modules/pdfjs-dist/build/pdf.worker.min.mjs";

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

      const fileContent = await extractFileContent(file);
      const markdownContent = await generateMarkdown(fileContent);

      const markdownFileName = `summary_${file.name.split(".")[0]}.md`;
      const markdownFile = new File([markdownContent], markdownFileName, {
        type: "text/markdown",
      });

      const response = await uploadFileToServer(markdownFile, idToken);

      if (response.ok) {
        setMessage(`Markdown file "${markdownFileName}" uploaded successfully!`);
      } else {
        const errorData = await response.json();
        setMessage(`Upload failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error during upload process:", error);
      setMessage("An error occurred during the upload process.");
    } finally {
      setLoading(false);
    }
  };

  const extractFileContent = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf") {
      throw new Error("Only PDF files are currently supported for summarization.");
    }

    try {
      const reader = new FileReader();

      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += `${pageText}\n\n`;
      }

      return fullText.trim();
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw new Error("Failed to extract text from PDF");
    }
  };

  const generateMarkdown = async (content: string): Promise<string> => {
    try {
      const response = await fetch("http://localhost:5174/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to generate summary: ${errorData.error}`);
      }

      const data = await response.json();
      const summary = data.summary;

      return `# Summary\n\n${summary}\n\n---\n\nGenerated using AutoNote.`;
    } catch (error) {
      console.error("Error generating summary:", error);
      throw error;
    }
  };

  const uploadFileToServer = async (file: File, token: string): Promise<Response> => {
    const fileData = await fileToBase64(file);
    return fetch("http://localhost:5174/api/notes", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        fileData: fileData.split(",")[1], // Remove base64 metadata
      }),
    });
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
      <Header />
      <div className="container center-content">
        <NavigationButtons />
        <h1>Upload Notes</h1>
        {!user ? (
          <p>You must be signed in to upload notes.</p>
        ) : (
          <div className="upload-form">
            <label htmlFor="file-upload" className="file-label">
              Choose a PDF file to upload (100mb max):
            </label>
            <input
              type="file"
              id="file-upload"
                className="file-input"
                accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleUpload}
              className="upload-btn"
              disabled={!file || loading}
            >
              {loading ? "Processing..." : "Upload"}
            </button>
            {message && <p className="upload-message">{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;