import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HomeModel } from './home.model';
import { HttpService } from '../../../core/http/http.service';
import { Observable } from 'rxjs';

@Injectable()
export class HomeResolver implements Resolve<HomeModel> {

    constructor(private httpService: HttpService) {
    }

    resolve(): Observable<HomeModel> {
        return this.httpService.get('/page/home');
    }

}
