import jwt from "jsonwebtoken";

import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const jwtService = {
  generateToken(user: any): string {
    return jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
  },

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  },
  generateTokenForRecover(): string {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    return tokenHash;
  },
};
