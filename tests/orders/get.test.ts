import {Item, Register} from "../util";
import supertest from "supertest";
import web from "../../src/applications/web";

describe('GET /api/orders/:id', () => {
    let token: string;
    beforeEach(async () => {
        await Register.add();
        await Item.add()
        token = await Register.login();
    })
    afterEach(async () => {
        await Register.remove();
        await Item.remove();
    })
    it('should can get orders', async () => {
        const item = await Item.get();
        const before = await supertest(web)
            .post('/api/orders')
            .set('X-API-TOKEN', token)
            .send({
                barcode: item!.barcode
            });
        const result = await supertest(web)
                .get(`/api/orders/${before.body.data.orderId}`)
                .set('X-API-TOKEN', token)
        const getItem = await Item.get();

        console.log(result.body);
        expect(result.status).toBe(200);
        expect(result.body.errors).toBeNull();
        expect(getItem!.stock).toBe(1);
        expect(result.body.message).toBe('Get order successfully')
    });

    it('should reject if orders not found', async () => {
        const result = await supertest(web)
            .get(`/api/orders/21312`)
            .set('X-API-TOKEN', token)
        const getItem = await Item.get();
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
        expect(getItem!.stock).toBe(2);
    });
});