import express from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {emailVerifyMiddleware} from "../middlewares/email-verify-middleware";
import {ProductControllers} from "../modules/product/controllers/product-controllers";
import {OrderController} from "../modules/order/controllers/order-controller";

const verifyApiRouter = express.Router();

verifyApiRouter.use(authMiddleware);
verifyApiRouter.use(emailVerifyMiddleware);

//products
verifyApiRouter.post('/api/products', ProductControllers.create);
verifyApiRouter.patch('/api/products/:id', ProductControllers.update);
verifyApiRouter.delete('/api/products/:id', ProductControllers.delete);

//orders
verifyApiRouter.post('/api/orders', OrderController.createOrder);
verifyApiRouter.patch('/api/orders/:id/update', OrderController.updateOrder);
verifyApiRouter.patch('/api/orders/:id/cancel', OrderController.cancelOrder);
verifyApiRouter.post('/api/orders/:id/delete', OrderController.deleteOrder);
verifyApiRouter.post('/api/orders/:id/product', OrderController.addProductOrder);
verifyApiRouter.post('/api/orders/:id/print', OrderController.printReceipt);

export default verifyApiRouter;
