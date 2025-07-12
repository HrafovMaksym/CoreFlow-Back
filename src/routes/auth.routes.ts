import { RequestHandler, Router } from "express";
import { authController } from "../controllers/auth.controller";

const authRouter = Router();

//auth routes
authRouter.post("/registration", authController.registration as RequestHandler);
authRouter.post("/login", authController.login as RequestHandler);
authRouter.get("/user", authController.logout as RequestHandler);

export { authRouter };
