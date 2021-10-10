import { ColorValue } from './colors.constants';

export interface UserAction {
    label: string;
    color: ColorValue;
    icon?: string;
    link?: string;
    value?: string | number;
    isHidden?: boolean;
    isActive?: boolean;
}

export interface ValidationError {
    field: string;
    message: string;
    code: number;
}
