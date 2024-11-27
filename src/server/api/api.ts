import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { verifyToken, uploadFile, getFiles, deleteFile } from "./firebase";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

// Middleware to Verify Firebase ID Token
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const idToken = req.headers.authorization?.split(" ")[1];
  if (!idToken) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try {
    const decodedToken = await verifyToken(idToken);
    req.user = decodedToken; // Add user info to the request object
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// Routes

// Upload a File
app.post("/upload", authenticate, async (req: Request, res: Response) => {
  const { fileName, fileData } = req.body;
  if (!fileName || !fileData) {
    return res.status(400).json({ error: "File name and data are required." });
  }
  try {
    const url = await uploadFile(fileName, fileData);
    res.status(201).json({ message: "File uploaded successfully.", url });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload file." });
  }
});

// Fetch All Notes
app.get("/notes", authenticate, async (_req: Request, res: Response) => {
  try {
    const files = await getFiles();
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch files." });
  }
});

// Delete a Note
app.delete("/notes/:fileName", authenticate, async (req: Request, res: Response) => {
  const { fileName } = req.params;
  try {
    await deleteFile(fileName);
    res.status(200).json({ message: `File "${fileName}" deleted successfully.` });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete file." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});