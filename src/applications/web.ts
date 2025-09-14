import express from 'express';
import {errorMiddleware} from "../middlewares/error-middleware";
import {apiRouter} from "../routers/auth-api";
import verifyApiRouter from "../routers/verify-api";
import authRouter from "../modules/auth/routers/auth.router";
import userRouter from "../modules/user/routers/user.router";

const web = express();

web.use(express.json());
web.use(express.urlencoded({ extended: false }));
web.use('/api/auth', authRouter);
web.use('/api/users', userRouter);
web.use(apiRouter);
web.use(verifyApiRouter);
web.use(errorMiddleware)

export default web;