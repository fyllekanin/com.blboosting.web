import { AdminPermissions, StaffPermissions } from '../../../core/auth/auth-user.model';

export class GroupClass {
    groupId: number;
    name: string;
    immunity: number;
    displayName: string;
    barStyle: string;
    nameColor: string;
    staffPermissions: StaffPermissions;
    adminPermissions: AdminPermissions;
    createdAt: number;
    updatedAt: number;
}
