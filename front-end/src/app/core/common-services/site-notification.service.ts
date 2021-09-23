import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
    SiteNotification,
    SiteNotificationType
} from '../../shared/app-views/site-notification/site-notification.interface';
import { ValidationError } from '../../shared/constants/common.interfaces';

@Injectable()
export class SiteNotificationService {
    private onSiteNotificationSubject: Subject<SiteNotification> = new Subject<SiteNotification>();
    onSiteNotification: Observable<SiteNotification> = this.onSiteNotificationSubject.asObservable();

    create (notification: SiteNotification): void {
        if (!notification) {
            return;
        }
        this.onSiteNotificationSubject.next(notification);
    }

    onError (errors: Array<ValidationError>): void {
        (errors || []).forEach(error => {
            const fieldMessage = error.field ? `<br /> - ${error.field}` : '';
            this.create({
                title: 'Validation error',
                message: `${error.message} ${fieldMessage}`,
                type: SiteNotificationType.ERROR
            });
        });
    }
}
