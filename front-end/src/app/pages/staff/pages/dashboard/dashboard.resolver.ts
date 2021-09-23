import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from '../../../../core/http/http.service';
import { Observable } from 'rxjs';
import { DashboardPage } from './dashboard.model';

@Injectable()
export class DashboardResolver implements Resolve<DashboardPage> {

    constructor(private httpService: HttpService) {
    }

    resolve(): Observable<DashboardPage> {
        return this.httpService.get('/staff/dashboard');
    }
}
