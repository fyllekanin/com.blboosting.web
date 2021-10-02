export interface AuthUserPermissions {
    CAN_LOGIN: boolean;
    CAN_CREATE_BOOST: boolean;
    CAN_MANAGE_GROUPS: boolean;
}

export interface AuthUser {
    id: string;
    discordId: string;
    username: string;
    accessToken: string;
    refreshToken: string;
    avatarHash: string;
    permissions: AuthUserPermissions;
}
