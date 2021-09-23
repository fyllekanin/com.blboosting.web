import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Slot, Timetable, TimeTableTypes } from './timetable.interface';
import { CombineSubscriptions, UnSub } from '../../decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';
import { TimetableService } from './timetable.service';
import { TimeHelper } from '../../helpers/time.helper';
import { UserAction } from '../../constants/common.interfaces';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-timetable',
    templateUrl: 'timetable.component.html',
    styleUrls: ['timetable.component.css']
})
@UnSub()
export class TimetableComponent implements OnDestroy {
    private readonly type: string;
    private day: number;

    readonly isPublic: boolean;
    @CombineSubscriptions()
    subscriber: Unsubscribable;
    title: string;
    data: Timetable;
    isRadio = false;

    actions: Array<UserAction> = [];

    constructor (
        private authService: AuthService,
        private service: TimetableService,
        private router: Router,
        activatedRoute: ActivatedRoute
    ) {
        this.type = activatedRoute.snapshot.data.type;
        this.isPublic = activatedRoute.snapshot.data.isPublic;
        this.isRadio = this.type === TimeTableTypes.RADIO;
        this.day = Number(activatedRoute.snapshot.params.day);
        this.subscriber = activatedRoute.params.subscribe(async data => {
            this.day = Number(data.day);
            await this.doSetup();
        });
    }

    onDaySwitch (action: UserAction): void {
        if (this.isPublic) {
            this.router.navigateByUrl(`/default/timetable/${this.type}/${action.value}`);
        } else {
            this.router.navigateByUrl(`/staff/radio/timetable/${action.value}`);
        }
    }

    async clickHour (slot: Slot): Promise<void> {
        if (this.isPublic) {
            return;
        }

        if (!slot.isBooked) {
            await this.doBooking(slot);
            return;
        }

        if ((this.authService.getAuthUser().staffPermissions.CAN_UNBOOK_OTHERS_RADIO && this.isRadio) ||
            this.authService.getAuthUser().staffPermissions.CAN_UNBOOK_OTHERS_EVENTS && !this.isRadio) {
            await this.doEdit(slot);
        } else {
            await this.service.unbook(slot, this.isRadio);
        }
    }

    ngOnDestroy (): void {
        // Empty
    }

    private async doEdit (slot: Slot): Promise<void> {
        const result = await this.service.doOpenDetails(slot, true, this.isRadio);
        if (!result.proceed) {
            return;
        }
        if (!result.isUnbooking) {
            slot.event = result.event;
            slot.user.username = result.username ? result.username : slot.user.username;
        }
        if (result.isUnbooking) {
            await this.service.unbook(slot, this.isRadio);
        } else {
            await this.service.edit(slot, this.isRadio);
        }
        await this.doSetup();
    }

    private async doBooking (slot: Slot): Promise<void> {
        const result = await this.service.doOpenDetails(slot, false, this.isRadio);
        if (!result.proceed) {
            return;
        }
        slot.event = result.event;
        await this.service.book(slot, this.isRadio);
        await this.doSetup();
    }

    private async doSetup (): Promise<void> {
        this.title = this.isRadio ? 'Radio Timetable' : 'Events Timetable';

        const slots = await this.service.fetchSlots(this.type);
        this.data = this.getDataWithCurrentSlots(slots);
        this.actions = [
            { label: 'Mon', value: 1, isActive: this.day === 1 },
            { label: 'Tue', value: 2, isActive: this.day === 2 },
            { label: 'Wed', value: 3, isActive: this.day === 3 },
            { label: 'Thu', value: 4, isActive: this.day === 4 },
            { label: 'Fri', value: 5, isActive: this.day === 5 },
            { label: 'Sat', value: 6, isActive: this.day === 6 },
            { label: 'Sun', value: 7, isActive: this.day === 7 }
        ];
    }

    private getDataWithCurrentSlots (data: Timetable): Timetable {
        const offset = TimeHelper.getTimeOffsetInHours();
        data.current = data.all.map(item => {
            const copy = { ...item };
            copy.hour = TimeHelper.getConvertedHour(item.hour + offset);
            copy.day = TimeHelper.getConvertedDay(item.hour + offset, item.day);
            copy.event = copy.event ? copy.event : { eventId: 0, name: 'Unknown', createdAt: 0, updatedAt: 0 };
            return copy;
        }).filter(item => item.day === this.day).sort((a, b) => {
            if (a.hour > b.hour) {
                return 1;
            } else if (a.hour < b.hour) {
                return -1;
            }
            return 0;
        });
        return data;
    }
}
