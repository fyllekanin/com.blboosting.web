import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-content',
    templateUrl: 'content.component.html',
    styleUrls: ['content.component.css'],
})
export class ContentComponent {
    @Input() header: string;
    @Input() titleBackground = '#9a7993';
    @Input() tooltipText: string;
}
