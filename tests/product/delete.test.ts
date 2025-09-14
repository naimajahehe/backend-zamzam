import { Item, Register } from "../util";
import Product from "../../src/models/product";
import supertest from "supertest";
import web from "../../src/applications/web";

describe('DELETE /api/products/:id', () => {
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

    it('should delete an existing product', async () => {
        const product = await Product.findOne({ stock: 2 });
        if (!product) throw new Error('Test product not found');

        const result = await supertest(web)
            .delete(`/api/products/${product._id.toString()}`)
            .set('X-API-TOKEN', token);

        console.log(result.body);
        expect(result.status).toBe(200);
        expect(result.body.success).toBeTruthy();
        expect(result.body.errors).toBeNull();
        expect(result.body.data.id).toBe(product._id.toString());
        expect(result.body.message).toBe('Product deleted successfully');

        const check = await Product.findById(product._id);
        expect(check).toBeNull();
    });

    it('should reject deletion with invalid ID', async () => {
        const result = await supertest(web)
            .delete('/api/products/invalidId123')
            .set('X-API-TOKEN', token);

        console.log(result.body);
        expect(result.status).toBe(400);
        expect(result.body.success).toBeFalsy();
        expect(result.body.data).toBeNull();
        expect(result.body.errors).toContain(': id tidak valid');
    });

    it('should reject deletion without auth token', async () => {
        const product = await Product.findOne({ stock: 2 });
        if (!product) throw new Error('Test product not found');

        const result = await supertest(web)
            .delete(`/api/products/${product._id.toString()}`);

        expect(result.status).toBe(401);
        expect(result.body.success).toBeFalsy();
        expect(result.body.data).toBeNull();
        expect(result.body.errors).toBe('Unauthorized');
    });

    it('should reject deletion of non-existent product', async () => {
        const nonExistentId = '64fa1c2e7b8a3e5f1c2d9b0a';
        const result = await supertest(web)
            .delete(`/api/products/${nonExistentId}`)
            .set('X-API-TOKEN', token);

        expect(result.status).toBe(404);
        expect(result.body.success).toBeFalsy();
        expect(result.body.data).toBeNull();
        expect(result.body.errors).toBe('Product not found');
    });
});
