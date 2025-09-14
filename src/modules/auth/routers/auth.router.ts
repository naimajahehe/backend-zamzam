import express, {Router} from "express";
import {AuthController} from "../controllers/auth.controller";

const authRouter: Router = express.Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.post('/verify-email', AuthController.verifyEmail);
authRouter.post('/verify-code', AuthController.verifyCode);
authRouter.post('/forgot-password', AuthController.forgotPassword);
authRouter.post('/reset-password', AuthController.resetPassword);

export default authRouter;