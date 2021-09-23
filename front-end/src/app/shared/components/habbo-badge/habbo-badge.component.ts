import { Component, HostListener, Input } from '@angular/core';
import { HabboBadgeClass } from '../../classes/habbo-badge.class';
import { Router } from '@angular/router';

@Component({
    selector: 'app-habbo-badge',
    templateUrl: 'habbo-badge.component.html',
    styleUrls: ['habbo-badge.component.css']
})
export class HabboBadgeComponent {
    @Input() badge: HabboBadgeClass;

    constructor (private router: Router) {
    }

    @HostListener('click')
    onClick (): void {
        if (this.badge.articleId) {
            this.router.navigateByUrl(`/default/article/${this.badge.articleId}`);
        }
    }
}
