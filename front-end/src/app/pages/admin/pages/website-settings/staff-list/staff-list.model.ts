export interface StaffListGroup {
    groupId: number;
    name: string;
    displayOrder: number;
    nameColor: string;
    isSelected: boolean;
}

export class StaffListModel {
    groups: Array<StaffListGroup> = [];
}
