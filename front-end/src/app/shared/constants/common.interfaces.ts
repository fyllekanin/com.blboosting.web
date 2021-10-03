export interface UserAction {
    label: string;
    value: string | number;
    isHidden?: boolean;
    isActive?: boolean;
}

export interface ValidationError {
    field: string;
    message: string;
    code: number;
}
