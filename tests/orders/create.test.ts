import {Item, Register} from "../util";
import supertest from "supertest";
import web from "../../src/applications/web";

describe('POST /api/orders', () => {
    let token: string;
    beforeEach(async () => {
        await Register.add();
        await Item.add();
        token = await Register.login();
    })
    afterEach(async () => {
        await Register.remove();
        await Item.remove();
    })
    it('should can create orders', async () => {
        const item = await Item.get();
        const result = await supertest(web)
            .post('/api/orders')
            .set('X-API-TOKEN', token)
            .send({
                barcode: item!.barcode
            })
        const getItem = await Item.get();

        expect(result.status).toBe(201);
        expect(result.body.errors).toBeNull();
        expect(getItem!.stock).toBe(1);
        expect(result.body.data.products).toBeDefined();
        expect(result.body.data.paymentMethod).toBe('cash');
        expect(result.body.data.paymentStatus).toBe('unpaid');
        expect(result.body.data.paymentDate).toBeNull();
        expect(result.body.data.orderStatus).toBe('pending');
        expect(result.body.data.isCompleted).toBeFalsy();
        expect(result.body.data.totalPrice).toBe(20000);
    });

    it('should reject if duplicate barcode order', async () => {
        const item = await Item.get();
        const before = await supertest(web)
            .post('/api/orders')
            .set('X-API-TOKEN', token)
            .send({
                barcode: item!.barcode
            });
        const result = await supertest(web)
            .post('/api/orders')
            .set('X-API-TOKEN', token)
            .send({
                barcode: item!.barcode
            });
        console.log(before.body.data);
        expect(result.body.success).toBeFalsy();
        expect(result.body.message).toBe('request error');
        expect(result.body.data).toBeNull();
        expect(result.body.errors).toBe(`This product is already in a pending order, id: ${before.body.data._id}`)
    });

    it('should reject if product not found', async () => {
        const result = await supertest(web)
            .post('/api/orders')
            .set('X-API-TOKEN', token)
            .send({
                barcode: 'INVALID_BARCODE'
            });

        expect(result.status).toBe(400);
        expect(result.body.success).toBeFalsy();
        expect(result.body.message).toBe('request error');
        expect(result.body.data).toBeNull();
        expect(result.body.errors).toBe('Product not found');
    });

    it('should reject if no token provided', async () => {
        const item = await Item.get();
        const result = await supertest(web)
            .post('/api/orders')
            .send({
                barcode: item!.barcode
            });

        expect(result.status).toBe(401);
        expect(result.body.success).toBeFalsy();
        expect(result.body.data).toBeNull();
        expect(result.body.message).toBeDefined();
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if token is invalid', async () => {
        const item = await Item.get();
        const result = await supertest(web)
            .post('/api/orders')
            .set('X-API-TOKEN', 'INVALID_TOKEN')
            .send({
                barcode: item!.barcode
            });

        expect(result.status).toBe(401);
        expect(result.body.success).toBeFalsy();
        expect(result.body.data).toBeNull();
        expect(result.body.message).toBeDefined();
        expect(result.body.errors).toBeDefined();
    });
});
