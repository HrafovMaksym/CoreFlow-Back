import { RequestHandler, Router } from "express";
import { authController } from "../controllers/auth.controller";

const authRouter = Router();

//auth routes
authRouter.post("/register", authController.register as RequestHandler);

export { authRouter };
