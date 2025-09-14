import { Item, Register } from "../util";
import ProductModel from "../../src/modules/product/models/product.model";
import supertest from "supertest";
import web from "../../src/applications/web";

describe('GET /api/products/:id', () => {
    let token: string;
    beforeEach(async () => {
        await Register.add();
        token = await Register.login();
        await Item.add();
    });

    afterEach(async () => {
        await Register.remove();
        await Item.remove();
    });

    it('should can get item', async () => {
        const product = await ProductModel.findOne({ stock: 2 });
        if (!product) throw new Error("Test product not found");

        const result = await supertest(web)
            .get(`/api/products/${product._id.toString()}`)
            .set('X-API-TOKEN', token);

        expect(result.status).toBe(200);
        expect(result.body.success).toBeTruthy();
        expect(result.body.data.id).toBe(product._id.toString());
        expect(result.body.errors).toBeNull();
    });

    it('should reject if id is invalid', async () => {
        const product = await ProductModel.findOne({ stock: 2 });
        if (!product) throw new Error("Test product not found");

        const result = await supertest(web)
            .get(`/api/products/asdfzxcv`)
            .set('X-API-TOKEN', token);

        expect(result.status).toBe(400);
        expect(result.body.success).toBeFalsy();
        expect(result.body.errors).not.toBeNull();
    });

    it('should reject if token is invalid', async () => {
        const product = await ProductModel.findOne({ stock: 2 });
        if (!product) throw new Error("Test product not found");

        const result = await supertest(web)
            .get(`/api/products/${product._id.toString()}`)
            .set('X-API-TOKEN', 'naimmnaim');

        expect(result.status).toBe(401);
        expect(result.body.success).toBeFalsy();
        expect(result.body.errors).not.toBeNull();
        expect(result.body.errors).toBe('Invalid Token');
    });

    it('should reject if token is empty', async () => {
        const product = await ProductModel.findOne({ stock: 2 });
        if (!product) throw new Error("Test product not found");

        const result = await supertest(web)
            .get(`/api/products/${product._id.toString()}`)

        expect(result.status).toBe(401);
        expect(result.body.success).toBeFalsy();
        expect(result.body.errors).not.toBeNull();
        expect(result.body.errors).toBe('Unauthorized');
    });
});
