import {Register} from "../util";
import supertest from "supertest";
import web from "../../src/applications/web";
import logger from "../../src/applications/logging";

describe('GET /api/users', () => {
    let token: string
    beforeEach(async () => {
        await Register.add();
        token = await Register.login();
    })
    afterEach(async () => {
        await Register.remove();
    })
    it('should can get user data', async () => {
        const result = await supertest(web)
            .get('/api/users')
            .set('X-API-TOKEN', token)
        console.log(result.body)
        expect(result.status).toBe(200);
        expect(result.body.errors).toBeNull();
        expect(result.body.success).toBeTruthy();
    });

    it('should reject if user is not login', async () => {
        const result = await supertest(web)
            .get('/api/users')
        logger.info(result.body);
        expect(result.status).toBe(401);
        expect(result.body.errors).toBe('Unauthorized');
        expect(result.body.success).toBeFalsy();
    });

    it('should reject if unvalid token', async () => {
        const result = await supertest(web)
            .get('/api/users')
            .set('X-API-TOKEN', 'naimmnai3123')
        logger.info(result.body);
        expect(result.status).toBe(401);
        expect(result.body.errors).toBe('Invalid Token');
        expect(result.body.success).toBeFalsy();
    });

    it('should respond in less than 500ms', async () => {
        const start = Date.now();
        const result = await supertest(web)
            .get('/api/users')
            .set('X-API-TOKEN', token);
        const duration = Date.now() - start;

        expect(result.status).toBe(200);
        expect(duration).toBeLessThan(500);
    });

    it('should reject if token header key is wrong', async () => {
        const result = await supertest(web)
            .get('/api/users')
            .set('Authorization', 'Bearer naimmnaim123');

        expect(result.status).toBe(401);
    });
});