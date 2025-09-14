import type {IUser} from "../../../types/user.types";
import type {AuthResponse} from "../../../types/auth.types";

export const authResponse = (user: IUser, token: string): AuthResponse => {
    return {
        email: user.email,
        username: user.username,
        id: user._id.toString(),
        token: token
    }
}