export interface SlimUserGroup {
    name: string;
    groupId: number;
    isSelected: boolean;
}

export interface UserGroupsModel {
    username: string;
    userId: number;
    groups: Array<SlimUserGroup>;
    displayGroupId: number;
}
