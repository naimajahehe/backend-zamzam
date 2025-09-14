import {Item, Register} from "../util";
import supertest from "supertest";
import web from "../../src/applications/web";

describe('GET /api/orders', () => {
    let token: string;
    beforeEach(async () => {
        await Register.add();
        await Item.add();
        token = await Register.login();
    });
    afterEach(async () => {
        await Register.remove();
        await Item.remove();
    });
    it('should get list of orders', async () => {
        const result = await supertest(web)
            .get('/api/orders')
            .set('X-API-TOKEN', token);
        console.log(result.body.data);
    });
    it('should get list of orders page 6', async () => {
        const result = await supertest(web)
            .get('/api/orders')
            .set('X-API-TOKEN', token)
            .query({
                page: 9,
                size: 3
            });
        console.log(result.body)
    });
});