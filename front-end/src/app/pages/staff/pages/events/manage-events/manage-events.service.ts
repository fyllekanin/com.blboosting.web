import { Injectable } from '@angular/core';
import { TimetableEvent } from '../../../../../shared/components/timetable/timetable.interface';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../../core/http/http.service';
import { SiteNotificationService } from '../../../../../core/common-services/site-notification.service';
import { SiteNotificationType } from '../../../../../shared/app-views/site-notification/site-notification.interface';
import { DialogService } from '../../../../../core/common-services/dialog.service';
import { take } from 'rxjs/operators';
import { CreateEventComponent } from './create-event/create-event.component';
import { ButtonTypes } from '../../../../../shared/app-views/dialog/dialog.model';

@Injectable()
export class ManageEventsService implements Resolve<Array<TimetableEvent>> {

    constructor(
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService,
        private dialogService: DialogService
    ) {
    }

    resolve(): Observable<Array<TimetableEvent>> {
        return this.httpService.get<Array<TimetableEvent>>('/staff/events/list');
    }

    async createEvent(): Promise<string> {
        return new Promise(async res => {
            this.dialogService.onComponentInstance.pipe(take(1)).subscribe(async ref => {
                this.dialogService.onAction.pipe(take(1)).subscribe(action => {
                    this.dialogService.close();
                    res(action.action === 'create' ? ref.instance.getEventName() : null);
                });
            });
            this.dialogService.open({
                title: 'Creating event',
                component: CreateEventComponent,
                buttons: [
                    {
                        label: 'Cancel',
                        action: 'cancel',
                        type: ButtonTypes.GRAY,
                        isClosing: true
                    },
                    {
                        label: 'Create',
                        action: 'create',
                        type: ButtonTypes.GREEN
                    }
                ]
            });
        });
    }

    create(name: string): Promise<void> {
        return this.httpService.post('/staff/events/event', {name: name}).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Event created',
                    type: SiteNotificationType.SUCCESS
                });
            })
            .catch(error => this.siteNotificationService.onError(error.error));

    }

    delete(eventId: number): Promise<void> {
        return this.httpService.delete(`/staff/events/event/${eventId}`).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Event deleted',
                    type: SiteNotificationType.SUCCESS
                });
            })
            .catch(error => this.siteNotificationService.onError(error.error));
    }
}
