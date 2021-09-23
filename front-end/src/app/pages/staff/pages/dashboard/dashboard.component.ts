import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardPage } from './dashboard.model';

@Component({
    selector: 'app-staff-dashboard',
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {
    data = {} as DashboardPage;

    constructor(activatedRoute: ActivatedRoute) {
        this.data = activatedRoute.snapshot.data.data;
    }

}
