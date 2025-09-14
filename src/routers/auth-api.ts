import express from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {UserControllers} from "../controllers/user-controllers";
import {ProductControllers} from "../controllers/product-controllers";
import {OrderControllers} from "../controllers/order-controllers";

export const apiRouter = express.Router();

apiRouter.use(authMiddleware);
//users
apiRouter.get('/api/users', UserControllers.get);
apiRouter.patch('/api/users', UserControllers.update);
apiRouter.post('/api/users/logout', UserControllers.logout);
apiRouter.patch('/api/users/password', UserControllers.updatePassword);
apiRouter.post('/api/users/send-verify-email', UserControllers.sendVerifyEmail);

//products
apiRouter.get('/api/products', ProductControllers.list);
apiRouter.get('/api/products/:id', ProductControllers.get);

//orders
apiRouter.get('/api/orders/:id', OrderControllers.getOrder);
apiRouter.get('/api/orders', OrderControllers.listOrder);
