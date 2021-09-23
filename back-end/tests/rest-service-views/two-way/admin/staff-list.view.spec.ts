import { StaffListView, StaffListViewEntry } from '../../../../src/rest-service-views/two-way/admin/staff-list.view';
import { InternalRequest } from '../../../../src/utilities/internal.request';

describe('StaffListView', () => {
    const entries: Array<StaffListViewEntry> = [
        { groupId: 1, name: '1', displayOrder: 1, nameColor: 'nameColor', isSelected: false },
        { groupId: 2, name: '2', displayOrder: 2, nameColor: 'nameColor', isSelected: true }
    ];

    it('should build correctly', () => {
        // When
        const entity = StaffListView.newBuilder()
            .withGroups(entries)
            .build();

        // Then
        expect(entity.getSelectedGroups().length).toEqual(1);
    });

    it('should build correctly from "of"', () => {
        // When
        const entity = StaffListView.of(<InternalRequest><unknown>{
            body: {
                groups: entries
            }
        });

        // Then
        expect(entity.getSelectedGroups().length).toEqual(1);
    });

});
