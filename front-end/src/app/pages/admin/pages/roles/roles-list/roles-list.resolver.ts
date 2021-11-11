import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { RolesListEntry } from '../roles.interfaces';
import { HttpService } from '../../../../../core/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RolesListResolver implements Resolve<{ total: number, page: number, items: Array<RolesListEntry> }> {

    constructor(private httpService: HttpService) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<{ total: number; page: number; items: Array<RolesListEntry> }> {
        const params = Object.keys(route.queryParams).reduce((prev, curr) => {
            if (route.queryParams[curr]) {
                prev[curr] = route.queryParams[curr];
            }
            return prev;
        }, {});
        return this.httpService.get(`/admin/roles/page/${route.params.page}`, {
            queryParameters: params
        })
            .pipe(map((data: { total: number; page: number; items: Array<RolesListEntry> }) => data));
    }
}
