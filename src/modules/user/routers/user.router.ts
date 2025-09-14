import express, {Router} from "express";
import {UserController} from "../controllers/user.controller";
import {authMiddleware} from "../../../middlewares/auth-middleware";

const userRouter: Router = express.Router();

userRouter.use(authMiddleware);

userRouter.get('/get', UserController.get);
userRouter.patch('/update', UserController.update);
userRouter.post('/logout', UserController.logout);
userRouter.patch('/password', UserController.updatePassword);
userRouter.post('/send-verify-email', UserController.sendVerifyEmail);

export default userRouter;