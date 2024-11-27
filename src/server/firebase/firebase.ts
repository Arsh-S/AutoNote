import { initializeApp, credential, auth, storage } from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin SDK
initializeApp({
  credential: credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = storage().bucket();

// Firebase Helper Functions

// Verify Firebase ID Token
export const verifyToken = async (idToken: string) => {
  try {
    const decodedToken = await auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error("Invalid ID token");
  }
};

// Upload a File to Firebase Storage
export const uploadFile = async (fileName: string, fileData: string): Promise<string> => {
  const fileBuffer = Buffer.from(fileData, "base64");
  const file = bucket.file(`notes/${fileName}`);
  await file.save(fileBuffer, { contentType: "application/pdf" });
  return `https://storage.googleapis.com/${bucket.name}/notes/${fileName}`;
};

// Fetch All Files from Firebase Storage
export const getFiles = async (): Promise<{ name: string; url: string }[]> => {
  const [files] = await bucket.getFiles({ prefix: "notes/" });
  return files.map((file) => ({
    name: file.name.split("/").pop()!,
    url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
  }));
};

// Delete a File from Firebase Storage
export const deleteFile = async (fileName: string): Promise<void> => {
  const file = bucket.file(`notes/${fileName}`);
  await file.delete();
};