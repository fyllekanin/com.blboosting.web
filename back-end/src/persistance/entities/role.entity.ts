import { ObjectId } from 'mongodb';
import { CreatedUpdatedAtEntity } from './created-updated-at.interface';

export enum RolePermission {
    CAN_LOGIN = 'CAN_LOGIN',
    CAN_CREATE_BOOST = 'CAN_CREATE_BOOST',
    CAN_MANAGE_ROLES = 'CAN_MANAGE_ROLES'
}

export interface IRolePermissions {
    CAN_LOGIN?: boolean;
    CAN_CREATE_BOOST?: boolean;
    CAN_MANAGE_ROLES?: boolean;
}

export interface IRoleEntity extends CreatedUpdatedAtEntity {
    _id?: ObjectId;
    discordId: string;
    name: string;
    position: number;
    permissions: IRolePermissions;
}
