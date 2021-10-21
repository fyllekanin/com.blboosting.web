import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserAction } from '../../constants/common.interfaces';
import { Router } from '@angular/router';

@Component({
    selector: 'app-content',
    templateUrl: 'content.component.html',
    styleUrls: ['content.component.css'],
})
export class ContentComponent {
    @Input() header: string;
    @Input() titleBackground = '#9a7993';
    @Input() tooltipText: string;
    @Input() actions: Array<UserAction> = [];


    @Output() onAction: EventEmitter<UserAction> = new EventEmitter();

    constructor(private router: Router) {
    }

    onLink(action: UserAction): void {
        this.router.navigate([action.link]);
    }
}
