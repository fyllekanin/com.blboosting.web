import { IdHelper } from '../../src/helpers/id.helper';

describe('IdHelper', () => {

    it('newUuid should return valid uuid', () => {
        // When
        const result = IdHelper.newUuid();

        // Then
        expect(result).toMatch(/[a-zA-Z-0-9\-]+/);
    });

});
