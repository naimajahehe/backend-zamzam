import {Register} from "../util";
import supertest from "supertest";
import web from "../../src/applications/web";
import logger from "../../src/applications/logging";

describe('POST /api/users/login', () => {
    afterEach(async () => {
        await Register.remove();
    })
    beforeEach(async () => {
        await Register.add();
    })
    it('should can login', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'naimmnaim123',
                password: 'asdfzxcv123'
            })
        console.log(result.body);
        expect(result.status).toBe(200);
        expect(result.body.success).toBeTruthy();
        expect(result.body.errors).toBeNull();
    });
    it('should reject if username is wrong', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'naimmnaim1',
                password: 'asdfzxcv123'
            })
        logger.info(result.body);
        expect(result.status).toBe(400);
        expect(result.body.success).toBeFalsy();
        expect(result.body.errors).not.toBeNull();
    });
    it('should reject if password is wrong', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'naimmnaim123',
                password: 'asdfzxcv1'
            });
        logger.info(result.body);
        expect(result.status).toBe(400);
        expect(result.body.success).toBeFalsy();
        expect(result.body.errors).not.toBeNull();
    });
});