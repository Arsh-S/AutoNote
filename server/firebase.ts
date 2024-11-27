// @ts-nocheck
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./service_account.json";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage().bucket();