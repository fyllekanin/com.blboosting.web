import { Component } from '@angular/core';
import { AuthService } from './../../../../../core/auth/auth.service';

@Component({
    selector: 'app-header-radio-content',
    templateUrl: 'radio-content.component.html'
})
export class RadioContentComponent {
    isLoggedIn = false;
    content = '';

    constructor(authService: AuthService) {
        this.isLoggedIn = authService.isLoggedIn();
    }
}
