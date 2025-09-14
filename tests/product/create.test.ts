import supertest from "supertest";
import web from "../../src/applications/web";
import {Item, Register} from "../util";

describe('POST /api/products', () => {
    let token: string;
    beforeEach(async () => {
        await Register.add();
        token = await Register.login();
    })
    afterEach(async () => {
        await Register.remove();
        await Item.remove();
    })
    it('should can create items', async () => {
        const result = await supertest(web)
            .post('/api/products')
            .set('X-API-TOKEN', token)
            .send({
                name: 'Bakso malang',
                brand: 'Indonesia',
                price: 20000,
                stock: 1,
                barcode: '12341234'
            })
        console.log(result.body)
        expect(result.status).toBe(201);
        expect(result.body.message).toBe('Product created successfully');
        expect(result.body.errors).toBeNull();
    });

    it('should reject if there is same barcode', async () => {
        await Item.add();
        const result = await supertest(web)
            .post('/api/products')
            .set('X-API-TOKEN', token)
            .send({
                name: 'Bakso malang',
                brand: 'Indonesia',
                price: 20000,
                stock: 1,
                barcode: '12341234'
            })
        expect(result.status).toBe(400);
        expect(result.body.message).toBe('request error');
        expect(result.body.data).toBeNull();
        expect(result.body.errors).toBe('The same barcode has already been entered');
    });

    it('should reject if required fields is missing', async () => {
        const result = await supertest(web)
            .post('/api/products')
            .set('X-API-TOKEN', token)
            .send({
                name: '',
                brand: '',
                price: -10,
                stock: -10,
                barcode: ''
            })
        console.log(result.body);
        expect(result.status).toBe(400);
        expect(result.body.message).toBe('validation error');
        expect(result.body.data).toBeNull();
    });

    it('should reject if no token is provided', async () => {
        const result = await supertest(web)
            .post('/api/products')
            .send({
                name: 'Bakso malang',
                brand: 'Indonesia',
                price: 20000,
                stock: 1,
                barcode: '12341234'
            })
        expect(result.status).toBe(401);
        expect(result.body.message).toBe('request error');
        expect(result.body.data).toBeNull();
        expect(result.body.errors).toBe('Unauthorized');
    });

    it('should reject if token is invalid', async () => {
        const result = await supertest(web)
            .post('/api/products')
            .set('X-API-TOKEN', 'naimmnm123')
            .send({
                name: 'Bakso malang',
                brand: 'Indonesia',
                price: 20000,
                stock: 1,
                barcode: '12341234'
            })
        expect(result.status).toBe(401);
        expect(result.body.message).toBe('Unauthorized');
        expect(result.body.data).toBeNull();
        expect(result.body.errors).toBe('Invalid Token');
    });

    it('should initialize sold to 0', async () => {
        const result = await supertest(web)
            .post('/api/products')
            .set('X-API-TOKEN', token)
            .send({
                name: 'Bakso Malang',
                brand: 'Indonesia',
                price: 20000,
                stock: 5,
                barcode: '12341234'
            });
        expect(result.body.data.sold).toBe(0);
    });
});