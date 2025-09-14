import express from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {ProductControllers} from "../modules/product/controllers/product-controllers";
import {OrderController} from "../modules/order/controllers/order-controller";

export const apiRouter = express.Router();

apiRouter.use(authMiddleware);

//products
apiRouter.get('/api/products', ProductControllers.list);
apiRouter.get('/api/products/:id', ProductControllers.get);

//orders
apiRouter.get('/api/orders/:id', OrderController.getOrder);
apiRouter.get('/api/orders', OrderController.listOrder);
