import { Register } from "../util";
import supertest from "supertest";
import web from "../../src/applications/web";

describe('Email Verification Flow', () => {
    let token: string;

    beforeEach(async () => {
        await Register.add();
        token = await Register.login();
    });

    afterEach(async () => {
        await Register.remove();
    });

    it('should send verify email', async () => {
        const result = await supertest(web)
            .post('/api/users/send-verify-email')
            .set('X-API-TOKEN', token);
        const user = await Register.get();

        expect(user!.isVerified).toBe(false);
        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.data).toBeDefined();
    });

    it('should verify email', async () => {
        const sendResult = await supertest(web)
            .post('/api/users/send-verify-email')
            .set('X-API-TOKEN', token);

        const verifyToken = sendResult.body.data;

        const result = await supertest(web)
            .get(`/api/users/verify-email?token=${verifyToken}`);
        const user = await Register.get();

        expect(user!.isVerified).toBe(true);
        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe('Verification email successfully');
    });

    it('should fail verify email with invalid token', async () => {
        const result = await supertest(web)
            .get('/api/users/verify-email?token=invalidtoken');

        expect(result.status).toBe(401);
        expect(result.body.success).toBe(false);
    });

    it('should fail verify email if token missing', async () => {
        const result = await supertest(web)
            .get('/api/users/verify-email');

        expect(result.status).toBe(400);
        expect(result.body.success).toBe(false);
    });

    it('should not send verify email if no auth token', async () => {
        const result = await supertest(web)
            .post('/api/users/send-verify-email');

        expect(result.status).toBe(401);
        expect(result.body.success).toBe(false);
    })

    it('should not verify email if already verified', async () => {
        const sendResult = await supertest(web)
            .post('/api/users/send-verify-email')
            .set('X-API-TOKEN', token);

        const verifyToken = sendResult.body.data;

        await supertest(web)
            .get(`/api/users/verify-email?token=${verifyToken}`);

        const result = await supertest(web)
            .get(`/api/users/verify-email?token=${verifyToken}`);

        expect(result.status).toBe(400);
        expect(result.body.success).toBe(false);
        expect(result.body.errors).toBe('User is already verified');
    });

    it('should fail sending verification email for non-existent user', async () => {
        await Register.remove();

        const result = await supertest(web)
            .post('/api/users/send-verify-email')
            .set('X-API-TOKEN', token);

        console.log(result.body);
        expect(result.status).toBe(401);
        expect(result.body.success).toBe(false);
    });
});
