import { Request, Response, NextFunction } from "express";
import { jwtService } from "../services/jwt.service";
import { User } from "@prisma/client";
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwtService.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log("Error while verifying token:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
