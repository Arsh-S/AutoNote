import express from "express";
import cors from "cors";
import authenticate from "./authenticate";
import { uploadFile, getFiles, deleteFile } from "./firebase";
import { generateSummary } from "./openai";

const app = express();
const PORT = 5174;

// make max file size 100mb for all uploads
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb" }));

app.use(cors({ origin: "http://localhost:5173" }));

// Home Route
app.get("/", (_req, res) => {
    res.send("API is running!");
});

// Summarize Endpoint
app.post("/api/summarize", async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: "Content is required for summarization." });
    }

    try {
        const summary = await generateSummary(content);
        res.status(200).json({ summary });
    } catch (error) {
        console.error("Error summarizing content:", error);
        res.status(500).json({ error: "Failed to generate summary." });
    }
});

// Upload File to Storage
app.post("/api/notes", authenticate, async (req, res) => {
    const { fileName, fileData } = req.body;
    if (!fileName || !fileData) {
        return res.status(400).json({ error: "File name and data are required." });
    }

    try {
        // Validate file extension
        if (!fileName.endsWith(".md")) {
            return res.status(400).json({ error: "Only Markdown (.md) files are allowed." });
        }

        const url = await uploadFile(fileName, fileData);
        res.status(201).json({ message: "File uploaded successfully.", url });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Failed to upload file." });
    }
});

// Get All Files
app.get("/api/notes", authenticate, async (_req, res) => {
    try {
        const files = await getFiles();
        res.status(200).json(files);
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).json({ error: "Failed to fetch files." });
    }
});

// Delete File
app.delete("/api/notes/:fileName", authenticate, async (req, res) => {
    const { fileName } = req.params;
    if (!fileName) {
        res.status(400).json({ error: "File name is required." });
        return;
    }
    try {
        await deleteFile(fileName);
        res.status(200).json({ message: `File "${fileName}" deleted successfully.` });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ error: "Failed to delete file." });
    }
});

// Proxy for files
app.get("/api/proxy-file", authenticate, async (req, res) => {
    const fileUrl = req.query.url as string;

    if (!fileUrl) {
        return res.status(400).json({ error: "File URL is required." });
    }

    try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const fileContent = await response.text();
        res.setHeader("Content-Type", "text/markdown");
        res.status(200).send(fileContent);
    } catch (error) {
        console.error("Error fetching file:", error);
        res.status(500).json({ error: "Failed to fetch file." });
    }
});

// Error Handler
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
