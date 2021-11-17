import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-default-error',
    templateUrl: 'error.component.html',
    styleUrls: ['error.component.scss']
})
export class ErrorComponent {
    message: string;

    constructor(activatedRoute: ActivatedRoute) {
        this.message = activatedRoute.snapshot.queryParams.message || 'Unknown Error';
    }
}
