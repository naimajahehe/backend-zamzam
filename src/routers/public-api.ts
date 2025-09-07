import express from "express";
import {UserControllers} from "../controllers/user-controllers";

export const publicRouter = express.Router();

publicRouter.post('/api/users', UserControllers.register);
publicRouter.post('/api/users/login', UserControllers.login);
publicRouter.get('/api/users/verify-email', UserControllers.verifyEmail);

// forgot-password
publicRouter.post('/api/users/forgot-password', UserControllers.forgotPassword);
publicRouter.post('/api/users/verify-code', UserControllers.verifyCode);
publicRouter.post('/api/users/reset-password', UserControllers.resetPassword);