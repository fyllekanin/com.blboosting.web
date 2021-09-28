import { Component } from '@angular/core';

@Component({
    selector: 'app-admin-boosts-boost',
    templateUrl: 'boost.component.html',
    styleUrls: ['boost.component.css']
})
export class BoostComponent {
    payments = [
        {
            amount: 0,
            realm: ''
        }
    ];

    realms = ['Kazzak', 'Tarren Mill', 'Stormscale'];

    addPaymentRow(): void {
        this.payments.push({ amount: 0, realm: '' });
    }

    remove(payment: any): void {
        this.payments = this.payments.filter(item => item !== payment);
    }
}
