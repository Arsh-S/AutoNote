import React, { useState } from "react";

const PDFUploadPage: React.FC = () => {
    const [title, setTitle] = useState("");
    return (
        <div className="upload-container">
            <h1 className="title">Upload PDF(s)</h1>
            <div className="upload-input">
                <input
                    type="file"
                    accept="application/pdf"
                    placeholder="PDF Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <button className="upload-button">Upload</button>
        </div>
    );
};

export default PDFUploadPage;
