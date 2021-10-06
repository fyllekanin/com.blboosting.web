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
        return this.httpService.get(`/admin/roles/page/${route.params.page}`)
            .pipe(map((data: { total: number; page: number; items: Array<RolesListEntry> }) => data));
    }
}
