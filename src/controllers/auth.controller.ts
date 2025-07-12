import bcrypt from "bcrypt";

import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../config/prisma.client";
import { jwtService } from "../services/jwt.service";
import { get } from "http";

export const authController = {
  async registration(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
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
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      if (!email || !password)
        return res.status(400).json({ message: "Data is missing" });

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) return res.status(400).json({ message: "Invalid permission" });

      const isPasswordValid = await bcrypt.compare(password, user?.password);
      if (!isPasswordValid)
        return res.status(400).json({ message: "Invalid permission" });

      const token = await jwtService.generateToken(user);

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(201).json({ message: "User login successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async getUser(req: Request, res: Response) {},
  async logout(req: Request, res: Response) {
    try {
      res.clearCookie("auth_token");
      return res.status(201).json({ message: "User logout successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
