import express from 'express';
import {publicRouter} from "../routers/public-api";
import {errorMiddleware} from "../middlewares/error-middleware";
import {apiRouter} from "../routers/api";

const web = express();

web.use(express.json());
web.use(express.urlencoded({ extended: false }));
web.use(publicRouter);
web.use(apiRouter);
web.use(errorMiddleware)

export default web;