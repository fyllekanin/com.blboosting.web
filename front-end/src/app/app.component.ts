import { Component } from '@angular/core';
import { ContinuesInformationService } from './core/common-services/continues-information.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(
        private continuesInformationService: ContinuesInformationService
    ) {
        this.addActivityListeners();
    }

    private addActivityListeners(): void {
        window.addEventListener('focus', () => {
            this.continuesInformationService.setUserState(true);
        });
        window.addEventListener('blur', () => {
            this.continuesInformationService.setUserState(false);
        });
    }
}
