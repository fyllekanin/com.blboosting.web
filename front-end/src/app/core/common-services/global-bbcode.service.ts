import { Injectable } from '@angular/core';
import { BbcodeClass } from '../../shared/classes/bbcode.class';
import { HttpService } from '../http/http.service';
import { Resolve } from '@angular/router';

@Injectable()
export class GlobalBbcodeService implements Resolve<Array<BbcodeClass>> {
    private static readonly CACHE_LIFETIME = 600;
    private cacheTime: number;
    private bbcodes: Array<BbcodeClass> = null;

    constructor(private httpService: HttpService) {
    }

    async resolve(): Promise<Array<BbcodeClass>> {
        return await this.getBbcodes();
    }

    async getBbcodes(): Promise<Array<BbcodeClass>> {
        if (this.bbcodes && this.cacheTime > (new Date().getTime() / 1000)) {
            return [...this.bbcodes];
        }
        this.bbcodes = await this.httpService.get<Array<BbcodeClass>>('/information/bbcodes')
            .toPromise();
        this.cacheTime = (new Date().getTime() / 1000) + GlobalBbcodeService.CACHE_LIFETIME;
        return [...this.bbcodes];
    }

    clearCache(): void {
        this.bbcodes = null;
    }
}
