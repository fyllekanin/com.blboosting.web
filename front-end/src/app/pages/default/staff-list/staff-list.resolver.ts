import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { StaffListModel } from './staff-list.model';
import { HttpService } from '../../../core/http/http.service';
import { Observable } from 'rxjs';

@Injectable()
export class StaffListResolver implements Resolve<StaffListModel> {

    constructor(private httpService: HttpService) {
    }

    resolve(): Observable<StaffListModel> {
        return this.httpService.get('/page/staff-list');
    }
}
