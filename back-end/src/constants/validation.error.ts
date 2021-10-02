export interface UserAction {
    label: string;
    value: string | number;
    isHidden?: boolean;
    isActive?: boolean;
}

export enum ValidationError {
    NOT_IN_GUILD = 1
}