import { RequestHandler, Router } from "express";
import { authController } from "../controllers/auth.controller";

const authRouter = Router();

//auth routes
authRouter.post("/registration", authController.registration as RequestHandler);

export { authRouter };
