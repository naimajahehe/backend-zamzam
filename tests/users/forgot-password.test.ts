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
            .post('/api/users/forgot-password')
            .send({
                email: 'naimmnaim123@gmail.com'
            })
        console.log(result.body);
    });
    it('should can verify code', async () => {
        const getCode = await supertest(web)
            .post('/api/users/forgot-password')
            .send({
                email: 'naimmnaim123@gmail.com'
            })
        const result = await supertest(web)
            .post('/api/users/verify-code')
            .send({
                verificationCode: getCode.body.data,
                email: 'naimmnaim123@gmail.com'
            })
        console.log(result.body)
    });
    it('should reset password successfully', async () => {
        // 1. forgot-password -> send verification code
        const forgotRes = await supertest(web)
            .post('/api/users/forgot-password')
            .send({ email: 'naimmnaim123@gmail.com' });

        const verificationCode = forgotRes.body.data;
        expect(forgotRes.status).toBe(200);
        expect(verificationCode).toBeDefined();

        // 2. verify code -> verify code
        const verifyRes = await supertest(web)
            .post('/api/users/verify-code')
            .send({
                verificationCode,
                email: 'naimmnaim123@gmail.com'
            });
        console.log(verifyRes.body);
        const resetToken = verifyRes.body.data.resetToken;
        expect(verifyRes.status).toBe(200);
        expect(resetToken).toBeDefined();

        // 3. reset password -> send new password
        const resetRes = await supertest(web)
            .post('/api/users/reset-password')
            .query({ token: resetToken })
            .send({
                newPassword: 'naimblog1234',
                confirmPassword: 'naimblog1234'
            });
        console.log(resetRes.body)
        expect(resetRes.status).toBe(200);
        expect(resetRes.body.success).toBe(true);
    });
});