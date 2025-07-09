import { Request, Response } from "express";

export const authController = {
  async register(req: Request, res: Response) {
    try {
    } catch (error) {
      console.log("Error while registering:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
