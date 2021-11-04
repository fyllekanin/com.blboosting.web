import { ButtonClasses } from './button.constants';

export interface UserAction {
    label: string;
    buttonClass: ButtonClasses;
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
