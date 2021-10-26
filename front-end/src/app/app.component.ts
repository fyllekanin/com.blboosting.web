import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, ResolveEnd, ResolveStart, Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    isLoading = false;
    width = '0%';

    constructor(router: Router) {
        router.events.subscribe(evt => {
            this.isLoading = true;
            if (evt instanceof NavigationStart) {
                this.width = '30%';
            }
            if (evt instanceof ResolveStart) {
                this.width = '60%';
            }
            if (evt instanceof ResolveEnd) {
                this.width = '80%';
            }
            if (evt instanceof NavigationEnd) {
                this.width = '100%';
                setTimeout(() => this.isLoading = false, 1000);
            }
        });
    }
}
