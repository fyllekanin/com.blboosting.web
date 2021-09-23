import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ConnectionInformationPage } from './connection-information.model';
import { HttpService } from '../../../../../core/http/http.service';
import { Observable } from 'rxjs';

@Injectable()
export class ConnectionInformationResolver implements Resolve<ConnectionInformationPage> {

    constructor(private httpService: HttpService) {
    }

    resolve(): Observable<ConnectionInformationPage> {
        return this.httpService.get('/staff/radio/connection-information');
    }
}
