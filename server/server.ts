import express, { Express, Request, Response } from "express";
import cors from "cors";

// Init
const app: Express = express();
const port = 8080;

app.use(cors());
app.use(express.json());

/**
 * GET /pdfs - Retrieve all PDFs
 */
app.get("/pdfs", (req: Request, res: Response) => {
    console.log("[GET] Fetching all PDFs");
});

/**
 * POST /pdfs - Upload a new PDF
 * Expects a JSON body with "title" property
 */
app.post("/pdfs", (req: Request, res: Response) => {
    console.log("[POST] Uploading new PDF");
});

/**
 * PUT /pdfs/:id - Update a PDF by ID
 */
app.put("/pdfs/:id", (req: Request, res: Response) => {
    console.log("[PUT] Updating PDF by ID");
});

/**
 * DELETE /pdfs/:id - Delete a PDF by ID
 */
app.delete("/pdfs/:id", (req: Request, res: Response) => {
    console.log("[DELETE] Removing PDF by ID");
});

/**
 * Root route - Basic welcome message
 */
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the PDF Project API");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
