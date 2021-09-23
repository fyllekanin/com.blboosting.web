import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobApplicationService } from './job-application.service';
import { JobApplicationModel } from './job-application.model';
import { SiteNotificationService } from '../../../core/common-services/site-notification.service';
import { SiteNotificationType } from '../../../shared/app-views/site-notification/site-notification.interface';

@Component({
    selector: 'app-default-job-application',
    templateUrl: 'job-application.component.html',
    styleUrls: ['job-application.component.css']
})
export class JobApplicationComponent {
    roles: Array<{ label: string, id: number, isChecked: boolean }> = [];
    data = {} as JobApplicationModel;
    aboutYou: string;
    previousExperience: string;
    additionalInformation: string;

    constructor(
        private siteNotificationService: SiteNotificationService,
        private service: JobApplicationService,
        activatedRoute: ActivatedRoute
    ) {
        this.roles = activatedRoute.snapshot.data.data;
    }

    async onPost(): Promise<void> {
        this.data.roles = this.roles.filter(role => role.isChecked).map(role => role.id);
        if (!this.aboutYou) {
            this.siteNotificationService.create({
                title: 'Missing data',
                message: 'You need to fill in "About you"',
                type: SiteNotificationType.ERROR
            });
            return;
        }
        if (!this.previousExperience) {
            this.siteNotificationService.create({
                title: 'Missing data',
                message: 'You need to fill in "Previous experience"',
                type: SiteNotificationType.ERROR
            });
            return;
        }
        this.data.content = '-- About me --\n';
        this.data.content += this.aboutYou;
        this.data.content += '\n-- Previous Experience --\n';
        this.data.content += this.previousExperience;
        if (this.additionalInformation) {
            this.data.content += '\n-- Additional Information --\n';
            this.data.content += this.additionalInformation;
        }

        if (await this.service.post(this.data)) {
            this.data = {} as JobApplicationModel;
            this.aboutYou = '';
            this.previousExperience = '';
            this.additionalInformation = '';
        }
    }


}
