import { SlimUser } from '../../../shared/classes/slim-user.class';

export interface StaffListRow {
    groupId: number;
    name: string;
    nameColor: string;
    displayOrder: number;
    users: Array<SlimUser>;
}

export interface StaffListModel {
    rows: Array<StaffListRow>;
}
