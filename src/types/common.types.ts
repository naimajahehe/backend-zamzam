import type {JwtPayload} from "jsonwebtoken";

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    errors: string | string[] | null;
    paging?: Paging;
}

export interface Paging {
    size: number;
    total_page: number;
    current_page: number;
}

export interface Pageable<T> {
    data: Array<T>;
    paging: Paging;
}

export interface TokenPayload extends JwtPayload {
    id: string;
}