import type {IUser} from "./user-models";

export type AuthRegisterRequest = Pick<IUser,
    'firstName' | 'lastName' | 'email' | 'username' | 'password' | 'gender'> & {
    confirmPassword: string
};

export type AuthLoginRequest = Pick<IUser,
    'username' | 'password'>;

export type AuthResponse = Pick<IUser,
    'username' | 'email'> & {
    id: string;
    token: string;
};

export type AuthTokenResponse = {
    token: string;
};

export type AuthResetPasswordRequest = {
    password: string,
    confirmPassword: string
}