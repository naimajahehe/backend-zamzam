export interface Paging {
    size: number;
    total_page: number;
    current_page: number;
}

export interface Pageable<T> {
    data: Array<T>;
    paging: Paging;
}