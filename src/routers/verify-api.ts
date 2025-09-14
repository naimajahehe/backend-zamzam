import express from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {emailVerifyMiddleware} from "../middlewares/email-verify-middleware";
import {ProductControllers} from "../controllers/product-controllers";
import {OrderControllers} from "../controllers/order-controllers";

const verifyApiRouter = express.Router();

verifyApiRouter.use(authMiddleware);
verifyApiRouter.use(emailVerifyMiddleware);

//products
verifyApiRouter.post('/api/products', ProductControllers.create);
verifyApiRouter.patch('/api/products/:id', ProductControllers.update);
verifyApiRouter.delete('/api/products/:id', ProductControllers.delete);

//orders
verifyApiRouter.post('/api/orders', OrderControllers.createOrder);
verifyApiRouter.patch('/api/orders/:id/update', OrderControllers.updateOrder);
verifyApiRouter.patch('/api/orders/:id/cancel', OrderControllers.cancelOrder);
verifyApiRouter.post('/api/orders/:id/delete', OrderControllers.deleteOrder);
verifyApiRouter.post('/api/orders/:id/product', OrderControllers.addProductOrder);
verifyApiRouter.post('/api/orders/:id/print', OrderControllers.printReceipt);

export default verifyApiRouter;
