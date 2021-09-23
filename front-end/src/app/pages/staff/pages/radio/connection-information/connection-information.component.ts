import { Component } from '@angular/core';
import { ConnectionInformationPage } from './connection-information.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../core/auth/auth.service';

@Component({
    selector: 'app-staff-radio-connection-information',
    templateUrl: 'connection-information.component.html'
})
export class ConnectionInformationComponent {
    data = {} as ConnectionInformationPage;
    username: string;

    constructor(
        authService: AuthService,
        activatedRoute: ActivatedRoute
    ) {
        this.username = authService.getAuthUser().username;
        this.data = activatedRoute.snapshot.data.data;
    }
}
