import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireSchedulerAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server configuration error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      type: string;
      internal: boolean;
    };

    if (decoded.type !== "scheduler" || !decoded.internal) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error("Scheduler auth error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
