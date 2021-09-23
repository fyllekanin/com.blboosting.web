import { PermissionHelper } from '../../src/helpers/permission.helper';
import { GroupEntity } from '../../src/persistance/entities/group/group.entity';
import { UserEntity } from '../../src/persistance/entities/user/user.entity';
import { AdminPermissions, StaffPermissions } from '../../src/rest-service-views/respond-views/user/auth-user.view';
import { ServiceConfig } from '../../src/utilities/internal.request';

describe('PermissionHelper', () => {

    it('getConvertedStaffPermissionsToNumber should return correctly converted value', () => {
        // Given
        const obj = <StaffPermissions><unknown>{
            CAN_BOOK_RADIO: true,
            CAN_BOOK_EVENTS: false
        };

        // When
        const result = PermissionHelper.getConvertedStaffPermissionsToNumber(obj);

        // Then
        expect(result).toEqual(1);
    });

    it('getConvertedAdminPermissionsToNumber should return correctly converted value', () => {
        // Given
        const obj = <AdminPermissions><unknown>{
            CAN_MANAGE_USER_GROUPS: true,
            CAN_SEE_LOGS: false
        };

        // When
        const result = PermissionHelper.getConvertedAdminPermissionsToNumber(obj);

        // Then
        expect(result).toEqual(4);
    });

    it('getConvertedStaffPermissionsToUI should return a correct StaffPermission object', () => {
        // Given
        const entity = GroupEntity.newBuilder()
            .withStaffPermissions(12)
            .build();

        // When
        const result = PermissionHelper.getConvertedStaffPermissionsToUI(entity);

        // Then
        expect(result.CAN_BOOK_RADIO).toBeFalse();
        expect(result.CAN_BOOK_EVENTS).toBeFalse();
        expect(result.CAN_UNBOOK_OTHERS_RADIO).toBeTrue();
        expect(result.CAN_UNBOOK_OTHERS_EVENTS).toBeTrue();
    });

    it('getConvertedAdminPermissionsToUI should return a correct StaffPermission object', () => {
        // Given
        const entity = GroupEntity.newBuilder()
            .withAdminPermissions(3)
            .build();

        // When
        const result = PermissionHelper.getConvertedAdminPermissionsToUI(entity);

        // Then
        expect(result.CAN_MANAGE_GROUPS).toBeTrue();
        expect(result.CAN_MANAGE_USER_BASICS).toBeTrue();
        expect(result.CAN_MANAGE_USER_GROUPS).toBeFalse();
        expect(result.CAN_MANAGE_STAFF_LIST).toBeFalse();
    });

    it('getConvertedStaffPermissionsForUser should return correct permissions', async () => {
        // Given
        const user = <UserEntity><unknown>{ userId: 1 };
        const serviceConfig = <ServiceConfig><unknown>{
            userGroupRepository: {
                getGroupIdsFromUser: () => <Array<number>>[1]
            },
            groupRepository: {
                getSuperAdmins: () => <Array<number>>[],
                doAnyGroupIdHaveStaffPermission: (_userId: number, _permission: number) => true
            }
        };

        // When
        const result = await PermissionHelper.getConvertedStaffPermissionsForUser(user, serviceConfig);

        // Then
        expect(result.CAN_UNBOOK_OTHERS_RADIO).toBeTrue();
    });

    it('getConvertedAdminPermissionsForUser should return correct permissions', async () => {
        // Given
        const user = <UserEntity><unknown>{ userId: 1 };
        const serviceConfig = <ServiceConfig><unknown>{
            userGroupRepository: {
                getGroupIdsFromUser: () => <Array<number>>[1]
            },
            groupRepository: {
                getSuperAdmins: () => <Array<number>>[],
                doAnyGroupIdHaveAdminPermission: (_userId: number, _permission: number) => true
            }
        };

        // When
        const result = await PermissionHelper.getConvertedAdminPermissionsForUser(user, serviceConfig);

        // Then
        expect(result.CAN_MANAGE_GROUPS).toBeTrue();
    });
});
