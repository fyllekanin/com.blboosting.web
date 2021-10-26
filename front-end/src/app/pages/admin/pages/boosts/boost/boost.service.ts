import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { BoostContext, IBoost } from '../boosts.interface';
import { HttpService } from '../../../../../core/http/http.service';

@Injectable()
export class BoostService implements Resolve<{ context: BoostContext }> {

    constructor(private httpService: HttpService) {
    }

    async submitBoost(boost: IBoost): Promise<void> {
        await this.httpService.post('/admin/boosts', boost).toPromise();
    }

    async resolve(): Promise<{ context: BoostContext }> {
        const context = await this.httpService.get<BoostContext>('/admin/boosts/context').toPromise();

        return {
            context: context
        };
    }
}
