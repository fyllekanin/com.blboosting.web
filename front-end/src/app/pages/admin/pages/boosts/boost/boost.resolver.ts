import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { BoostContext } from '../boosts.interface';
import { HttpService } from '../../../../../core/http/http.service';

@Injectable()
export class BoostResolver implements Resolve<{ context: BoostContext }> {

    constructor(private httpService: HttpService) {
    }

    async resolve(): Promise<{ context: BoostContext }> {
        const context = await this.httpService.get<BoostContext>('/admin/boosts/context').toPromise();

        return {
            context: context
        };
    }
}
