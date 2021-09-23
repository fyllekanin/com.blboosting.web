import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { IPagination } from '../../../../../../shared/components/pagination/pagination.model';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../../../core/http/http.service';
import { SlimUser } from '../../../../../../shared/classes/slim-user.class';

@Injectable()
export class UserListService implements Resolve<IPagination<SlimUser>> {

    constructor(private httpService: HttpService) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<IPagination<SlimUser>> {
        return this.getPage(route.params.page, route.queryParams);
    }

    getPage(page: number, params?: { [key: string]: string }): Observable<IPagination<SlimUser>> {
        return this.httpService.get(`/admin/users/users/page/${page}`, {params: params});
    }
}
