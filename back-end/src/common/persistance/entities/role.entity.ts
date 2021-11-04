import { ObjectId } from 'mongodb';
import { CreatedUpdatedAtEntity } from './created-updated-at.interface';

export enum RolePermission {
    CAN_LOGIN = 'CAN_LOGIN',
    CAN_CREATE_BOOST = 'CAN_CREATE_BOOST',
    CAN_MANAGE_ROLES = 'CAN_MANAGE_ROLES',
    CAN_COLLECT_PAYMENTS = 'CAN_COLLECT_PAYMENTS'
}

export interface IRolePermissions {
    CAN_LOGIN?: boolean;
    CAN_CREATE_BOOST?: boolean;
    CAN_MANAGE_ROLES?: boolean;
    CAN_COLLECT_PAYMENTS?: boolean;
}

export interface IRoleEntity extends CreatedUpdatedAtEntity {
    _id?: ObjectId;
    discordId: string;
    name: string;
    position: number;
    permissions: IRolePermissions;
}
