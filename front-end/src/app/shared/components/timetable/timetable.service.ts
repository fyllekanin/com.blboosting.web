import { Injectable } from '@angular/core';
import { BookingResult, Slot, Timetable, TimetableEvent, TimeTableTypes } from './timetable.interface';
import { HttpService } from '../../../core/http/http.service';
import { SiteNotificationService } from '../../../core/common-services/site-notification.service';
import { DialogService } from '../../../core/common-services/dialog.service';
import { take } from 'rxjs/operators';
import { TimeHelper } from '../../helpers/time.helper';
import { DetailedSlotComponent } from './detailed-slot/detailed-slot.component';
import { ButtonTypes, DialogButton } from '../../app-views/dialog/dialog.model';
import { SiteNotificationType } from '../../app-views/site-notification/site-notification.interface';

@Injectable()
export class TimetableService {
    private bookingActions: Array<DialogButton> = [
        {label: 'Cancel', action: 'cancel', type: ButtonTypes.GRAY, isClosing: true},
        {label: 'Book', action: 'book', type: ButtonTypes.GREEN}
    ];
    private editingActions: Array<DialogButton> = [
        {label: 'Cancel', action: 'cancel', type: ButtonTypes.GRAY, isClosing: true},
        {label: 'Unbook', action: 'unbook', type: ButtonTypes.BLUE},
        {label: 'Save', action: 'book', type: ButtonTypes.GREEN}
    ];

    constructor(
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService,
        private dialogService: DialogService
    ) {
    }

    async doOpenDetails(slot: Slot, isEditing: boolean, isRadio: boolean): Promise<BookingResult> {
        return new Promise(async res => {
            const presentedHour = TimeHelper.getHours().find(hour => hour.number === slot.hour);

            this.dialogService.onComponentInstance.pipe(take(1)).subscribe(async ref => {
                ref.instance.setup(slot, await this.getEvents(), isRadio);
                this.dialogService.onAction.pipe(take(1)).subscribe(action => {
                    this.dialogService.close();

                    res({
                        proceed: action.action === 'book' || action.action === 'unbook',
                        event: ref.instance.getEvent(),
                        username: ref.instance.getBookFor(),
                        isUnbooking: action.action === 'unbook'
                    });
                });
            });
            this.dialogService.open({
                title: `${isEditing ? 'Editing' : 'Booking'} ${TimeHelper.getDay(slot.day).label} - ${presentedHour.label}`,
                component: DetailedSlotComponent,
                buttons: isEditing ? this.editingActions : this.bookingActions
            });
        });
    }

    async edit(slot: Slot, isRadio: boolean): Promise<unknown> {
        return this.httpService.put(`/staff/${isRadio ? 'radio' : 'events'}/${slot.timetableId}`, slot).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Slot updated',
                    type: SiteNotificationType.SUCCESS
                });
            })
            .catch(error => this.siteNotificationService.onError(error.error));
    }

    async book(slot: Slot, isRadio: boolean): Promise<unknown> {
        const copy = {...slot};
        const offsetInHours = copy.hour + TimeHelper.getHourOffsetRounded();
        const convertedHour = TimeHelper.getConvertedHour(offsetInHours);
        const convertedDay = TimeHelper.getConvertedDay(offsetInHours, slot.day);
        copy.hour = convertedHour;
        copy.day = convertedDay;

        return this.httpService.post(`/staff/${isRadio ? 'radio' : 'events'}/book`, copy).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Slot booked',
                    type: SiteNotificationType.SUCCESS
                });
            })
            .catch(error => this.siteNotificationService.onError(error.error));
    }

    async unbook(slot: Slot, isRadio: boolean): Promise<void> {
        return new Promise(async res => {
            const presentedHour = TimeHelper.getHours().find(hour => hour.number === slot.hour);
            const result = await this.dialogService
                .confirm(`Do you really wanna unbook this slot on ${TimeHelper.getDay(slot.day).label} - ${presentedHour.label}`);
            if (result) {
                await this.httpService.delete(`/staff/${isRadio ? 'radio' : 'events'}/unbook/${slot.timetableId}`).toPromise()
                    .then(() => {
                        this.siteNotificationService.create({
                            title: 'Success',
                            message: 'Slot unbooked',
                            type: SiteNotificationType.SUCCESS
                        });
                    })
                    .catch(error => this.siteNotificationService.onError(error.error));
            }
            res();
        });
    }

    fetchSlots(type: string): Promise<Timetable> {
        return this.httpService.get(`/staff/${type === TimeTableTypes.RADIO ? 'radio' : 'events'}/slots`).toPromise()
            .then((slots: Array<Slot>) => ({
                all: slots,
                current: [],
                type: type
            } as Timetable));
    }

    private async getEvents(): Promise<Array<TimetableEvent>> {
        return await this.httpService.get<Array<TimetableEvent>>('/staff/events/list').toPromise();
    }

}
