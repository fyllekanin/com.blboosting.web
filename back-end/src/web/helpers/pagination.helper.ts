export class PaginationHelper {
    static readonly TEN_ITEMS = 10;
    static readonly TWENTY_ITEMS = 20;

    static getSkip (page: number, itemsPerPage: number): number {
        return page >= 2 ? (itemsPerPage * page) - itemsPerPage : 0;
    }

    static getTotalAmountOfPages (itemsPerPage: number, totalItems: number): number {
        const pages = Math.ceil(totalItems / itemsPerPage);
        return pages > 0 ? pages : 1;
    }
}
