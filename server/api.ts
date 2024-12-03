import express from "express";
import cors from "cors";
import authenticate from "./authenticate";
import { uploadFile, getFiles, deleteFile } from "./firebase";

const app = express();
const PORT = 5174;


// make max file size 100mb for all uploads 
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb'}));

app.use(cors({ origin: "http://localhost:5173" }));

// Home Route
app.get("/", (_req, res) => {
  res.send("API is running!");
});

// Upload File
app.post("/api/notes", authenticate, async (req, res) => {
  const { fileName, fileData } = req.body;
  console.log(fileData.length);
  if (!fileName || !fileData) {
    res.status(400).json({ error: "File name and data are required." });
    return;
  }
  try {
    const url = await uploadFile(fileName, fileData);
    res.status(201).json({ message: "File uploaded successfully."});
  }
  catch (error) {
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

// Error Handler
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});