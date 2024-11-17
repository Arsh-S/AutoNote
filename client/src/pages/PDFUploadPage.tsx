import React, { useState } from 'react';
import "./PDFUploadPage.css";

const PDFUploadPage: React.FC = () => {
  const [title, setTitle] = useState("");

  return (
    <div>
      <h1>Upload PDF</h1>
      <input
        type="text"
        placeholder="PDF Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button>Upload</button>
    </div>
  );
};

export default PDFUploadPage;