import { UserPermissions } from '../../../../core/auth/auth.model';

export interface RoleEntry {
    _id: string;
    name: string;
    discordId: string;
    position: number;
    permissions: UserPermissions;
}

export interface RolesListEntry {
    _id: string;
    name: string;
    discordId: string;
    position: number;
}
