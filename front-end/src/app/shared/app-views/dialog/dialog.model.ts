import { Type } from '@angular/core';

export enum ButtonTypes {
    GREEN = 'green',
    BLUE = 'blue',
    RED = 'red',
    GRAY = 'gray'
}

export interface DialogButton {
    label: string;
    action: string;
    type: string;
    isClosing?: boolean;
}

export interface DialogConfiguration<T> {
    component?: Type<T>;
    title: string;
    content?: string;
    buttons: Array<DialogButton>;
}
