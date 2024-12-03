import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./firebase";

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  const idToken = authHeader?.split(" ")[1];

  if (!idToken) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  try {
      const decodedToken = await verifyToken(idToken);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

export default authenticate;