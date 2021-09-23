import { InternalRequest } from '../../../../../src/utilities/internal.request';
import { UserGroupsView } from '../../../../../src/rest-service-views/two-way/admin/user-groups.view';

describe('UserGroupsPayload', () => {

    it('should be correct after using of', () => {
        // Given
        const req = <InternalRequest><unknown>{
            body: {
                userId: 55,
                groups: [
                    { name: '1', groupId: 1, isSelected: true },
                    { name: '2', groupId: 2, isSelected: false },
                    { name: '3', groupId: 3, isSelected: true }
                ],
                displayGroupId: 1
            }
        };

        // When
        const result = UserGroupsView.of(req);

        // Then
        expect(result.getUserId()).toEqual(55);
        expect(result.getDisplayGroupId()).toEqual(1);
        expect(result.getSelectedGroupIds()).toEqual([ 1, 3 ]);
    });

});
