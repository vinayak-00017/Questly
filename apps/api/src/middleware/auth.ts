import { NextFunction, Request, Response } from "express";
import { auth } from "../../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

export interface AuthenticatedRequest extends Request {
  userId: string;
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Get the session from the request
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.session || !session.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Add the userId to the request for use in route handlers
  (req as AuthenticatedRequest).userId = session.session.userId;

  next();
}
