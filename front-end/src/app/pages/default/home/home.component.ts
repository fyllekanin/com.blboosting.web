import { Component } from '@angular/core';
import { HomeModel } from './home.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Slot } from '../../../shared/components/timetable/timetable.interface';
import { TimeHelper } from '../../../shared/helpers/time.helper';
import { UserAction } from '../../../shared/constants/common.interfaces';
import { SlideShowImage } from '../../../shared/components/slide-show/slide-show.component';

@Component({
    selector: 'app-default-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})
export class HomeComponent {
    data = {} as HomeModel;
    slots: Array<Slot> = [];

    images: Array<SlideShowImage> = [];
    contentActions: Array<UserAction> = [
        {label: 'See More', value: 0}
    ];

    constructor(
        private router: Router,
        activatedRoute: ActivatedRoute
    ) {
        this.data = activatedRoute.snapshot.data.data;
        this.images = this.data.bannerEntries.map((entry, index) => ({
            id: entry.id,
            link: `/resources/banner-entries/${entry.id}.gif`,
            caption: entry.caption,
            isActive: index === 0
        }));
        this.slots = this.getTimeConvertedSlots(this.data.todayEvents);
    }

    async onSeeMore(type: number): Promise<void> {
        await this.router.navigate(
            ['default', 'articles', 'page', 1],
            {
                queryParams: {
                    type: type
                }
            }
        );
    }

    private getTimeConvertedSlots(slots: Array<Slot>): Array<Slot> {
        const hours = TimeHelper.getHours();
        return slots.map(slot => {
            const copy = {...slot};

            const offsetInHours = copy.hour + TimeHelper.getTimeOffsetInHours();
            copy.hour = TimeHelper.getConvertedHour(offsetInHours);
            copy.day = TimeHelper.getConvertedDay(offsetInHours, slot.day);
            copy.displayHour = hours.find(hour => hour.number === copy.hour).label;

            return copy;
        });
    }
}
