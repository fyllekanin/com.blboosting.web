import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDashboard } from './dashboard.interface';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent {
    context: IDashboard;

    constructor(activatedRoute: ActivatedRoute) {
        this.context = activatedRoute.snapshot.data.data;
    }
}
