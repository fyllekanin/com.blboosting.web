export interface IPagination<T> {
    total: number;
    page: number;
    items: Array<T>;
}

export interface IPaginationResolver<T> {
    pagination: IPagination<T>;
}
