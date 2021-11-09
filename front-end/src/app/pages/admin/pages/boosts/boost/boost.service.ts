import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { BoostContext, IBoost } from '../boosts.interface';
import { HttpService } from '../../../../../core/http/http.service';
import { SiteNotificationService } from '../../../../../core/common-services/site-notification.service';
import { SiteNotificationType } from '../../../../../shared/app-views/site-notification/site-notification.interface';

@Injectable()
export class BoostService implements Resolve<{ context: BoostContext }> {

    constructor(
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService
    ) {
    }

    async submitBoost(boost: IBoost): Promise<boolean> {
        for (const key of boost.keys) {
            delete key.availableBoosters;
        }
        return await this.httpService.post('/admin/boosts', boost).toPromise().then(() => {
            this.siteNotificationService.create({
                title: 'Success',
                message: 'Boost posted!',
                type: SiteNotificationType.SUCCESS
            });
            return true;
        }, () => false);
    }

    async resolve(): Promise<{ context: BoostContext }> {
        const context = await this.httpService.get<BoostContext>('/admin/boosts/context').toPromise();

        return {
            context: context
        };
    }
}
