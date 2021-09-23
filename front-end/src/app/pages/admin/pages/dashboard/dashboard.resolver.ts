import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DashboardPage } from './dashboard.model';
import { HttpService } from '../../../../core/http/http.service';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardResolver implements Resolve<DashboardPage> {

    constructor(private httpService: HttpService) {
    }

    resolve(): Observable<DashboardPage> {
        return this.httpService.get('/admin/dashboard');
    }
}
