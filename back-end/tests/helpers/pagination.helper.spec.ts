import { PaginationHelper } from '../../src/helpers/pagination.helper';

describe('PaginationHelper', () => {

    describe('getSkip', () => {
        it('should return 0 if page is 1 or less', () => {
            // Given
            const page = 1;

            // When
            const result = PaginationHelper.getSkip(page, 10);

            // Then
            expect(result).toEqual(0);
        });
        it('should return correct skip if page is 2 or more', () => {
            // Given
            const page = 2;

            // When
            const result = PaginationHelper.getSkip(page, 10);

            // Then
            expect(result).toEqual(10);
        });
    });

    describe('getTotalAmountOfPages', () => {
        const itemsPerPage = 15;
        it('should return 1 if total is less then itemsPerPage', () => {
            // Given
            const totalItems = 13;

            // When
            const result = PaginationHelper.getTotalAmountOfPages(itemsPerPage, totalItems);

            // Then
            expect(result).toEqual(1);
        });
        it('should reutrn 2 if total is greater then itemsPerPage', () => {
            // Given
            const totalItems = 20;

            // When
            const result = PaginationHelper.getTotalAmountOfPages(itemsPerPage, totalItems);

            // Then
            expect(result).toEqual(2);
        });
        it('it should ceil the result so if bearly above itemsPerPage it should step a page', () => {
            // Given
            const totalItems = 16;

            // When
            const result = PaginationHelper.getTotalAmountOfPages(itemsPerPage, totalItems);

            // Then
            expect(result).toEqual(2);
        });
    });
});
