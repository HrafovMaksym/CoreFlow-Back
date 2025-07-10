import bcrypt from "bcrypt";

import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../config/prisma.client";
import { jwtService } from "../services/jwt.service";

export const authController = {
  async registration(req: Request, res: Response) {
    try {
      const { email, password, name } = await req.body;
      console.log(email, password, name);
      if (!email || !password || !name)
        return res.status(400).json({ message: "Data is missing" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      console.log("user", user);
      const token = await jwtService.generateToken(user);

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        res.status(400).json({ message: "User already exists" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  },
};
