import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { BoostContext, IBoost, IBooster } from '../boosts.interface';
import { HttpService } from '../../../../../core/http/http.service';
import { SiteNotificationService } from '../../../../../core/common-services/site-notification.service';
import { SiteNotificationType } from '../../../../../shared/app-views/site-notification/site-notification.interface';
import { IPagination } from '../../../../../shared/components/pagination/pagination.interface';

@Injectable()
export class BoostService implements Resolve<{ context: BoostContext }> {

    constructor(
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService
    ) {
    }

    async submitBoost(boost: IBoost): Promise<boolean> {
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

    async getBoosters(page: number, filters?: {
        armors?: Array<string>,
        classes?: Array<string>,
        name?: string
    }): Promise<IPagination<IBooster>> {
        const search = new URLSearchParams();
        if (filters?.name) search.append('name', filters.name);
        (filters?.armors || []).forEach(item => search.append('armors', item));
        (filters?.classes || []).forEach(item => search.append('classes', item));

        return await this.httpService.get<IPagination<IBooster>>(`/admin/boosters/key/page/${page}?${search.toString()}`)
            .toPromise();
    }
}
