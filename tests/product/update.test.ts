import { Item, Register } from "../util";
import Product from "../../src/models/product";
import supertest from "supertest";
import web from "../../src/applications/web";
import logger from "../../src/applications/logging";

describe('PATCH /api/products/:id', () => {
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

    it('should update an existing product', async () => {
        const product = await Product.findOne({ stock: 1 });
        if (!product) throw new Error('Test product not found');

        const result = await supertest(web)
            .patch(`/api/products/${product._id.toString()}`)
            .set('X-API-TOKEN', token)
            .send({
                name: 'Updated Product',
                brand: 'Updated Brand',
                price: 25000,
                stock: 2
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.success).toBeTruthy();
        expect(result.body.errors).toBeNull();
        expect(result.body.data.name).toBe('Updated Product');
        expect(result.body.data.brand).toBe('Updated Brand');
        expect(result.body.data.price).toBe(25000);
        expect(result.body.data.stock).toBe(2);
    });

    it('should reject update with invalid product ID', async () => {
        const result = await supertest(web)
            .patch('/api/products/invalidId123')
            .set('X-API-TOKEN', token)
            .send({
                name: 'Test',
                brand: 'Test Brand',
                price: 10000,
                stock: 1
            });

        expect(result.status).toBe(404);
        expect(result.body.success).toBeFalsy();
        expect(result.body.data).toBeNull();
        expect(result.body.errors).toBe('Product not found');
    });

    it('should reject update without auth token', async () => {
        const product = await Product.findOne({ stock: 1 });
        if (!product) throw new Error('Test product not found');

        const result = await supertest(web)
            .patch(`/api/products/${product._id.toString()}`)
            .send({
                name: 'Test',
                brand: 'Test Brand',
                price: 10000,
                stock: 1
            });

        expect(result.status).toBe(401);
        expect(result.body.success).toBeFalsy();
        expect(result.body.data).toBeNull();
        expect(result.body.errors).toBe('Unauthorized');
    });

    it('should reject update with invalid body', async () => {
        const product = await Product.findOne({ stock: 1 });
        if (!product) throw new Error('Test product not found');

        const result = await supertest(web)
            .patch(`/api/products/${product._id.toString()}`)
            .set('X-API-TOKEN', token)
            .send({
                name: '',
                brand: 'B',
                price: -100,
                stock: -5
            });

        expect(result.status).toBe(400);
        expect(result.body.success).toBeFalsy();
        expect(result.body.data).toBeNull();
        expect(result.body.errors).not.toBeNull();
    });
});
