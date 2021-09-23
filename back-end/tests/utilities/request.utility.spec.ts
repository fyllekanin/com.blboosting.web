import { InternalRequest } from '../../src/utilities/internal.request';
import { RequestUtility } from '../../src/utilities/request.utility';

describe('RequestUtility', () => {

    describe('getAccessToken', () => {
        it('should return null if no header for "Authorization" exists', () => {
            // Given
            const req = <InternalRequest><unknown>{
                header: (): string => null
            };

            // When
            const result = RequestUtility.getAccessToken(req);

            // Then
            expect(result).toBeNull();
        });
        it('should return null if the header does not start with Bearer', () => {
            // Given
            const req = <InternalRequest><unknown>{
                header: (): string => 'Not'
            };

            // When
            const result = RequestUtility.getAccessToken(req);

            // Then
            expect(result).toBeNull();
        });
        it('should return the token if correctly formatted and exists', () => {
            // Given
            const req = <InternalRequest><unknown>{
                header: (): string => 'Bearer token'
            };

            // When
            const result = RequestUtility.getAccessToken(req);

            // Then
            expect(result).toEqual('token');
        });
    });
});
