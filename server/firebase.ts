import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { ServiceAccount } from "firebase-admin";

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set.");
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
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
export const uploadFile = async (fileName: string, fileData: string) => {
    try {
      const filePath = `uploads/${fileName}`;
      const file = storage.file(filePath);
  
      const buffer = Buffer.from(fileData, "base64");
  
      await file.save(buffer, {
        metadata: { contentType: "text/markdown" },
      });
  
      const publicUrl = `https://storage.googleapis.com/${storage.name}/${filePath}`;
      return publicUrl;
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
                .filter((file) => file.name !== "uploads/")
                .filter((file) => !file.name.endsWith("/"))
                .map(async (file) => {
                    const [url] = await file.getSignedUrl({
                        action: "read",
                        expires: "03-01-2030",
                    });
                    return {
                        name: file.name.replace("uploads/", ""),
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