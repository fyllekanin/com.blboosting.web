import { Component } from '@angular/core';
import { BoostContext, IBoost, IBoostKey, IBoostPayment } from '../boosts.interface';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from '../../../../../shared/components/form/select/select.interface';
import { UserAction } from '../../../../../shared/constants/common.interfaces';
import { ColorValue } from '../../../../../shared/constants/colors.constants';

@Component({
    selector: 'app-admin-boosts-boost',
    templateUrl: 'boost.component.html',
    styleUrls: ['boost.component.css'],
})
export class BoostComponent {
    context: BoostContext;
    entity: IBoost = {
        _id: null,
        name: null,
        boost: {
            name: null,
            realm: null,
            source: null,
            armor: 'ANY',
            class: 'ANY'
        },
        playAlong: {
            name: null,
            realm: null,
            role: null
        },
        keys: [{ level: 0, dungeon: null, isTimed: false, keyHolder: { discordId: null, role: null } }],
        payments: [{ realm: null, amount: 0, faction: null }]
    };

    actions: Array<UserAction> = [
        { label: 'Save', color: ColorValue.GREEN, value: 'save' },
        { label: 'Back', color: ColorValue.BLUE, link: '/admin/boosts/page/1' }
    ];

    realms: Array<SelectItem> = [];

    constructor(activatedRoute: ActivatedRoute) {
        this.context = activatedRoute.snapshot.data.data.context;
        this.realms = this.context.realms.map(realm => ({ label: realm.name, value: realm }));
    }

    async onAction(action: UserAction): Promise<void> {
        if (action.value === 'save') {
            // Do something
        }
    }

    onAddPaymentRow(index: number): void {
        if (this.entity.payments.length >= 4) {
            return;
        }
        this.entity.payments.splice(index - 1, 0, { realm: null, amount: 0, faction: null });
    }

    onRemovePaymentRow(payment: IBoostPayment): void {
        if (this.entity.payments.length === 1) {
            return;
        }
        this.entity.payments = this.entity.payments.filter(item => item !== payment);
    }

    onAddKeyRow(index: number): void {
        if (this.entity.keys.length >= 4) {
            return;
        }
        this.entity.keys.splice(index - 1, 0, {
            level: 0,
            dungeon: null,
            isTimed: false,
            keyHolder: { discordId: null, role: null }
        });
    }

    onRemoveKeyRow(key: IBoostKey): void {
        if (this.entity.keys.length === 1) {
            return;
        }
        this.entity.keys = this.entity.keys.filter(item => item !== key);
    }
}
