import {Register} from "../util";
import supertest from "supertest";
import web from "../../src/applications/web";

describe('POST /api/users/logout', () => {
    let token: string
    beforeEach(async () => {
        await Register.add();
        token = await Register.login();
    })
    afterEach(async () => {
        await Register.remove();
    })

    it('should can logout', async () => {
        const result = await supertest(web)
            .post('/api/users/logout')
            .set('X-API-TOKEN', token)

        expect(result.status).toBe(200);
        expect(result.body.success).toBeTruthy();
        expect(result.body.message).toBe('User logged out successfully');
        expect(result.body.data).toBeNull();
        expect(result.body.errors).toBeNull();
    });

    it('should reject if empty token', async () => {
        const result = await supertest(web)
            .post('/api/users/logout')

        expect(result.status).toBe(401);
        expect(result.body.success).toBeFalsy();
        expect(result.body.message).toBe('request error');
        expect(result.body.data).toBeNull();
        expect(result.body.errors).toBe('Unauthorized');
    });

    it('should reject if invalid token', async () => {
        const result = await supertest(web)
            .post('/api/users/logout')
            .set('X-API-TOKEN', 'asdfzxcv123');

        expect(result.status).toBe(401);
        expect(result.body.success).toBeFalsy();
        expect(result.body.message).toBe('Unauthorized');
        expect(result.body.data).toBeNull();
        expect(result.body.errors).toBe('Invalid Token');
    });
});


