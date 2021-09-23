import { GroupView } from '../../../../src/rest-service-views/two-way/admin/group.view';
import { InternalRequest } from '../../../../src/utilities/internal.request';
import {
    AdminPermissions,
    StaffPermissions
} from '../../../../src/rest-service-views/respond-views/user/auth-user.view';

describe('GroupView', () => {

    it('should be possible to build', () => {
        // When
        const result = GroupView.newBuilder()
            .withGroupId(1)
            .withName('name')
            .withImmunity(100)
            .withDisplayName('displayName')
            .withBarStyle('barStyle')
            .withNameColor('color')
            .withStaffPermissions(null)
            .withAdminPermissions(null)
            .withCreatedAt(0)
            .withUpdatedAt(0)
            .build();

        // Then
        expect(result.getGroupId()).toEqual(1);
        expect(result.getName()).toEqual('name');
        expect(result.getImmunity()).toEqual(100);
        expect(result.getDisplayName()).toEqual('displayName');
        expect(result.getBarStyle()).toEqual('barStyle');
        expect(result.getNameColor()).toEqual('color');
        expect(result.getStaffPermissions()).toEqual(<StaffPermissions><unknown>{});
        expect(result.getAdminPermissions()).toEqual(<AdminPermissions><unknown>{});
        expect(result.getCreatedAt()).toEqual(0);
        expect(result.getUpdatedAt()).toEqual(0);
    });

    it('should build correctly from of', () => {
        // Given
        const req = <InternalRequest><unknown>{
            body: {
                groupId: 1,
                name: 'name',
                immunity: 100,
                displayName: 'displayName',
                barStyle: 'barStyle',
                nameColor: 'color',
                staffPermissions: null,
                adminPermissions: null
            }
        };

        // When
        const result = GroupView.of(req);

        // Then
        expect(result.getGroupId()).toEqual(1);
        expect(result.getName()).toEqual('name');
        expect(result.getImmunity()).toEqual(100);
        expect(result.getDisplayName()).toEqual('displayName');
        expect(result.getBarStyle()).toEqual('barStyle');
        expect(result.getNameColor()).toEqual('color');
        expect(result.getStaffPermissions()).toEqual(<StaffPermissions><unknown>{});
        expect(result.getAdminPermissions()).toEqual(<AdminPermissions><unknown>{});
    });
});
