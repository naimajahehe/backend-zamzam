import {Register} from "../util";
import supertest from "supertest";
import web from "../../src/applications/web";

describe('Forgot Password Flow', () => {
    beforeEach(async () => {
        await Register.add();
    });
    afterEach(async () => {
        await Register.remove()
    })
    it('should can send email code', async () => {
        const result = await supertest(web)
            .post('/api/auth/forgot-password')
            .send({
                email: 'naimmnaim123@gmail.com'
            })
        console.log(result.body);
    });
    it('should can verify code', async () => {
        const getCode = await supertest(web)
            .post('/api/auth/forgot-password')
            .send({
                email: 'naimmnaim123@gmail.com'
            })
        const result = await supertest(web)
            .post('/api/auth/verify-code')
            .query({
                email: 'naimmnaim123@gmail.com'
            })
            .send({
                verificationCode: getCode.body.data,
            })
        console.log(result.body)
    });
    it('should reset password successfully', async () => {
        // 1. forgot-password -> send verification code
        const forgotRes = await supertest(web)
            .post('/api/auth/forgot-password')
            .send({ email: 'naimmnaim123@gmail.com' });

        const verificationCode = forgotRes.body.data;
        console.log(forgotRes.body);
        expect(forgotRes.status).toBe(200);
        expect(verificationCode).toBeDefined();

        // 2. verify code -> verify code
        const verifyRes = await supertest(web)
            .post('/api/auth/verify-code')
            .query({
                email: 'naimmnaim123@gmail.com'
            })
            .send({
                verificationCode,
            });
        console.log(verifyRes.body);
        const resetToken = verifyRes.body.data.token;
        expect(verifyRes.status).toBe(200);
        expect(resetToken).toBeDefined();

        // 3. reset password -> send new password
        const resetRes = await supertest(web)
            .post('/api/auth/reset-password')
            .query({ token: resetToken })
            .send({
                password: 'naimblog1234',
                confirmPassword: 'naimblog1234'
            });
        console.log(resetRes.body)
        expect(resetRes.status).toBe(200);
        expect(resetRes.body.success).toBe(true);
    });
});