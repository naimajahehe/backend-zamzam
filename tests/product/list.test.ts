import {Item, Register} from "../util";
import supertest from "supertest";
import web from "../../src/applications/web";

describe('GET /api/products', () => {
    let token: string;
    beforeEach(async () => {
        await Register.add();
        token = await Register.login();
        await Item.addMany();
    });

    afterEach(async () => {
        await Register.remove();
        await Item.remove();
    });

    it('should return list of products', async () => {
        const result = await supertest(web)
            .get('/api/products')
            .set('X-API-TOKEN', token);
        expect(result.status).toBe(200);
        expect(Array.isArray(result.body.data)).toBe(true);
        expect(result.body.paging).toHaveProperty('size');
        expect(result.body.paging).toHaveProperty('total_page');
        expect(result.body.paging).toHaveProperty('current_page');
    });

    it('should filter products by name', async () => {
        const result = await supertest(web)
            .get('/api/products')
            .query({ name: 'a' })
            .set('X-API-TOKEN', token);
        expect(result.status).toBe(200);
        expect(result.body.data.every((p: any) => p.name.toLowerCase().includes('a'))).toBe(true);
    });

    it('should filter products by brand', async () => {
        const result = await supertest(web)
            .get('/api/products')
            .query({ brand: 'Wardah' })
            .set('X-API-TOKEN', token);
        expect(result.status).toBe(200);
        expect(result.body.data.every((p: any) => p.brand.toLowerCase().includes('wardah'))).toBe(true);
    });

    it('should filter products by name and brand', async () => {
        const result = await supertest(web)
            .get('/api/products')
            .query({ name: 'a', brand: 'Wardah' })
            .set('X-API-TOKEN', token);
        expect(result.status).toBe(200);
        console.log(result.body);
        expect(result.body.data.every((p: any) =>
            p.brand.toLowerCase().includes('wardah')
        )).toBe(true);
    });

    it('should paginate products', async () => {
        const result = await supertest(web)
            .get('/api/products')
            .query({ page: 2, size: 10 })
            .set('X-API-TOKEN', token);
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBeLessThanOrEqual(10);
        expect(result.body.paging.current_page).toBe(2);
    });

    it('should return empty array for non-matching query', async () => {
        const result = await supertest(web)
            .get('/api/products')
            .query({ name: 'nonexistentname' })
            .set('X-API-TOKEN', token);
        expect(result.status).toBe(200);
        expect(result.body.data).toEqual([]);
    });

    it('should sort products by createdAt descending', async () => {
        const result = await supertest(web)
            .get('/api/products')
            .set('X-API-TOKEN', token);
        expect(result.status).toBe(200);
        const dates = result.body.data.map((p: any) => new Date(p.createdAt).getTime());
        for (let i = 1; i < dates.length; i++) {
            expect(dates[i]).toBeLessThanOrEqual(dates[i - 1]);
        }
    });

    it('should respect size query parameter', async () => {
        const result = await supertest(web)
            .get('/api/products')
            .query({ size: 5 })
            .set('X-API-TOKEN', token);
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBeLessThanOrEqual(5);
    });

    it('should handle missing API token', async () => {
        const result = await supertest(web)
            .get('/api/products');
        expect(result.status).toBe(401);
    });

    it('should handle invalid page number', async () => {
        const result = await supertest(web)
            .get('/api/products')
            .query({ page: -1 })
            .set('X-API-TOKEN', token);
        expect(result.status).toBe(400);
    });
});

