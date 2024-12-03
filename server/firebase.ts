import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { ServiceAccount } from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const serviceAccountPath = path.resolve("./service-account.json");

const app = initializeApp({
    credential: cert(require(serviceAccountPath)),
    storageBucket: `${require(serviceAccountPath).project_id}.firebasestorage.app`,
});

export const auth = getAuth(app);
export const storage = getStorage(app).bucket();

// Verify Firebase ID Token
export const verifyToken = async (idToken: string) => {
    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        // console.error(idToken);
        return decodedToken;
    } catch (error) {
        console.error("Error verifying token:", error);
        throw new Error("Unauthorized: Invalid token");
    }
};

// Upload File to Firebase Storage
export const uploadFile = async (fileName: string, fileData: string): Promise<string> => {
    try {
        const filePath = `uploads/${fileName}`;
        const file = storage.file(filePath);

        const base64Data = fileData.split(",").pop();

        if (!base64Data) {
            throw new Error("Invalid base64 data");
        }

        const buffer = Buffer.from(base64Data, "base64");

        await file.save(buffer, {
            metadata: {
                contentType: getContentType(fileName),
                metadata: {
                    firebaseStorageDownloadTokens: uuidv4(),
                },
            },
        });

        const [url] = await file.getSignedUrl({
            action: "read",
            expires: "03-01-2030",
        });

        console.log("File uploaded and accessible at:", url);
        return url;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Failed to upload file");
    }
};
// Retrieve All Files from Firebase Storage
export const getFiles = async () => {
    try {
        const [files] = await storage.getFiles({ prefix: "uploads/" });

        const validFiles = await Promise.all(
            files
                .filter((file) => file.name !== "uploads/") // Exclude pseudo-directory
                .filter((file) => !file.name.endsWith("/")) // Exclude folder-like objects
                .map(async (file) => {
                    const [url] = await file.getSignedUrl({
                        action: "read",
                        expires: "03-01-2030", // Set expiration date for signed URL
                    });
                    return {
                        name: file.name.replace("uploads/", ""), // Strip 'uploads/' prefix
                        url,
                    };
                })
        );

        return validFiles;
    } catch (error) {
        console.error("Error fetching files:", error);
        throw new Error("Failed to fetch files");
    }
};

// Delete File from Firebase Storage
export const deleteFile = async (fileName: string) => {
    try {
        const filePath = `uploads/${fileName}`;
        const file = storage.file(filePath);
        await file.delete();
        console.log(`File deleted: ${fileName}`);
    } catch (error) {
        console.error("Error deleting file:", error);
        throw new Error("Failed to delete file");
    }
};

// Helper to Determine Content Type Based on File Extension
const getContentType = (fileName: string): string => {
    const ext = path.extname(fileName).toLowerCase();
    switch (ext) {
        case ".pdf":
            return "application/pdf";
        case ".jpg":
        case ".jpeg":
            return "image/jpeg";
        case ".png":
            return "image/png";
        case ".txt":
            return "text/plain";
        default:
            return "application/octet-stream";
    }
};
