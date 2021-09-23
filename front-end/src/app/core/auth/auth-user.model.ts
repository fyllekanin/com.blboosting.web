export interface StaffPermissions {
    CAN_BOOK_RADIO: boolean;
    CAN_BOOK_EVENTS: boolean;
    CAN_UNBOOK_OTHERS_RADIO: boolean;
    CAN_UNBOOK_OTHERS_EVENTS: boolean;
    CAN_WRITE_ARTICLES: boolean;
    CAN_MANAGE_ARTICLES: boolean;
    CAN_KICK_DJ_OFF_AIR: boolean;
    CAN_MANAGE_EVENT_TYPES: boolean;
    CAN_UPLOAD_RESOURCES: boolean;
}

export interface AdminPermissions {
    CAN_MANAGE_GROUPS: boolean;
    CAN_MANAGE_USER_BASICS: boolean;
    CAN_MANAGE_USER_ADVANCED: boolean;
    CAN_MANAGE_USER_GROUPS: boolean;
    CAN_SEE_LOGS: boolean;
    CAN_MANAGE_STAFF_LIST: boolean;
    CAN_MANAGE_RADIO_SETTINGS: boolean;
    CAN_MANAGE_HOME_PAGE: boolean;
    CAN_MANAGE_BBCODES: boolean;
}

export interface AuthUser {
    userId: number;
    username: string;
    habbo: string;
    accessToken: string;
    refreshToken: string;
    adminPermissions: AdminPermissions;
    staffPermissions: StaffPermissions;
    doHaveAdminPermissions: boolean;
    doHaveStaffPermissions: boolean;
}
