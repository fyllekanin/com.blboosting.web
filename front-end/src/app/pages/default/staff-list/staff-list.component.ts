import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StaffListModel } from './staff-list.model';

@Component({
    selector: 'app-default-staff-list',
    templateUrl: 'staff-list.component.html',
    styleUrls: ['staff-list.component.css']
})
export class StaffListComponent {
    data = {} as StaffListModel;

    constructor(activatedRoute: ActivatedRoute) {
        this.data = activatedRoute.snapshot.data.data;
    }
}
