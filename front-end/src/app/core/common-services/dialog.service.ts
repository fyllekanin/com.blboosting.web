import { ComponentRef, Injectable } from '@angular/core';
import { ButtonTypes, DialogButton, DialogConfiguration } from '../../shared/app-views/dialog/dialog.model';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class DialogService {
    private onOpenSubject = new Subject<DialogConfiguration<any>>();
    private onCloseSubject = new Subject<void>();
    private onComponentInstanceSubject = new Subject<ComponentRef<any>>();
    onActionSubject = new Subject<DialogButton>();
    onOpen = this.onOpenSubject.asObservable();
    onClose = this.onCloseSubject.asObservable();
    onAction = this.onActionSubject.asObservable();
    onComponentInstance = this.onComponentInstanceSubject.asObservable();

    /**
     * Open a new instance of a dialog
     *
     * Listen to onAction to know when something happend.
     * When closed by clicking outside of it, then a action will
     * not be triggered.
     *
     * @param configuration
     */
    open<T>(configuration: DialogConfiguration<T>): void {
        this.onOpenSubject.next(configuration);
    }

    setComponentInstance(componentInstance: ComponentRef<any>): void {
        this.onComponentInstanceSubject.next(componentInstance);
    }

    confirm(message: string): Promise<boolean> {
        return new Promise(res => {
            this.open({
                title: 'Confirmation',
                content: message,
                buttons: [
                    {
                        label: 'Cancel',
                        action: 'cancel',
                        type: ButtonTypes.GRAY,
                        isClosing: true
                    },
                    {
                        label: 'Yes',
                        action: 'yes',
                        type: ButtonTypes.GREEN
                    }
                ]
            });
            this.onAction.pipe(take(1)).subscribe(button => {
                this.close();
                res(button.action === 'yes');
            });
        });
    }

    /**
     * Closes the dialog if open
     */
    close(): void {
        this.onCloseSubject.next();
    }
}
