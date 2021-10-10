export interface UserPermissions {
    CAN_LOGIN: boolean;
    CAN_CREATE_BOOST: boolean;
    CAN_MANAGE_ROLES: boolean;
}

export interface AuthUser {
    id: string;
    discordId: string;
    username: string;
    accessToken: string;
    refreshToken: string;
    avatarHash: string;
    permissions: UserPermissions;
}
