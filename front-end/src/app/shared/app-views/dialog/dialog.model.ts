import { Type } from '@angular/core';

export interface DialogButton {
    label: string;
    action?: string;
    type: 'button-red' | 'button-green' | 'button-blue' | 'button-gray';
    isClosing?: boolean;
}

export interface DialogConfiguration<T> {
    component?: Type<T>;
    title: string;
    content?: string;
    buttons: Array<DialogButton>;
}
