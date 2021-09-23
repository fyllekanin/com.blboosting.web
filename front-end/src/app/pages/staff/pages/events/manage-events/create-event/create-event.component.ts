import { Component } from '@angular/core';

@Component({
    selector: 'app-staff-events-create',
    templateUrl: 'create-event.component.html'
})
export class CreateEventComponent {

    name: string;

    getEventName (): string {
        return this.name;
    }
}
