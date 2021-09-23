import { Component } from '@angular/core';
import { ISideMenu } from '../../shared/components/side-menu/side-menu.interface';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    selector: 'app-staff',
    templateUrl: 'staff.component.html',
    styleUrls: ['staff.component.css']
})
export class StaffComponent {
    menus: Array<ISideMenu> = [];

    constructor (authService: AuthService) {
        const user = authService.getAuthUser();
        const day = new Date().getDay() === 0 ? 7 : new Date().getDay();

        this.menus = [
            {
                title: 'General',
                items: [
                    {
                        label: 'Dashboard',
                        url: '/staff',
                        icon: 'fas fa-home',
                        isApplicable: true
                    }
                ]
            },
            {
                title: 'Radio',
                items: [
                    {
                        label: 'Timetable',
                        url: `/staff/radio/timetable/${day}`,
                        icon: 'fas fa-table',
                        isApplicable: user.staffPermissions.CAN_BOOK_RADIO
                    },
                    {
                        label: 'Requests',
                        url: `/staff/radio/requests`,
                        icon: 'fas fa-table',
                        isApplicable: user.staffPermissions.CAN_BOOK_RADIO
                    },
                    {
                        label: 'Connection Information',
                        url: `/staff/radio/connection-information`,
                        icon: 'fas fa-table',
                        isApplicable: user.staffPermissions.CAN_BOOK_RADIO ||
                            user.staffPermissions.CAN_UNBOOK_OTHERS_RADIO
                    },
                ]
            },
            {
                title: 'Events',
                items: [
                    {
                        label: 'Timetable',
                        url: `/staff/events/timetable/${day}`,
                        icon: 'fas fa-table',
                        isApplicable: user.staffPermissions.CAN_BOOK_EVENTS
                    },
                    {
                        label: 'Manage Event Types',
                        url: '/staff/events/manage',
                        icon: 'fas fa-table',
                        isApplicable: user.staffPermissions.CAN_MANAGE_EVENT_TYPES
                    }
                ]
            },
            {
                title: 'Media',
                items: [
                    {
                        label: 'Articles',
                        url: '/staff/media/articles/page/1',
                        icon: 'fas fa-hashtag',
                        isApplicable: user.staffPermissions.CAN_WRITE_ARTICLES || user.staffPermissions.CAN_MANAGE_ARTICLES
                    }
                ]
            }
        ];
    }
}
