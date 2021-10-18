import { Component } from '@angular/core';
import { BoostContext, IBoost } from '../boosts.interface';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from '../../../../../shared/components/form/select/select.interface';

@Component({
    selector: 'app-admin-boosts-boost',
    templateUrl: 'boost.component.html',
    styleUrls: ['boost.component.css'],
})
export class BoostComponent {
    context: BoostContext;
    boost: IBoost = {
        boost: {
            name: null,
            realm: null,
            source: null
        }
    };

    sources: Array<{ value: string; label: string }> = [
        { label: 'TC', value: 'Trade Chat' },
        { label: 'TCL', value: 'Ticket Client' },
        { label: 'TIH', value: 'Ticket In-house' },
        { label: 'D', value: 'Discord' },
    ];
    payments: Array<{ amount: number; realm: string }> = [
        {
            amount: 0,
            realm: '',
        },
    ];
    keys: Array<{ key: string; userId?: string; role?: string }> = [
        {
            key: '',
            userId: '',
            role: '',
        },
    ];
    dungeons = [
        { label: 'Any', value: 'Any' },
        { label: 'De Other Side', value: 'DOS' },
        { label: 'Halls of Atonement', value: 'HOA' },
        { label: 'Mists of Tirna Scithe', value: 'MISTS' },
        { label: 'Plaguefall', value: 'PLAGUE' },
        { label: 'Sanguine Depths', value: 'SD' },
        { label: 'Spires of Ascension', value: 'SD' },
        { label: 'The Necrotic Wake', value: 'TNW' },
        { label: 'Theater of Pain', value: 'TOP' },
        { label: 'Tazavesh the Veiled Market', value: 'TAZ' },
    ];
    armorStacks = [
        { label: 'Any', value: 'Any' },
        { label: 'Leather', value: 'Leather' },
        { label: 'Plate', value: 'Plate' },
        { label: 'Mail', value: 'Mail' },
        { label: 'Cloth', value: 'Cloth' },
    ];
    classStacks = [
        { label: 'Any', value: 'Any' },
        { label: 'Warrior', value: 'Warrior' },
        { label: 'Paladin', value: 'Paladin' },
        { label: 'Hunter', value: 'Hunter' },
        { label: 'Rogue', value: 'Rogue' },
        { label: 'Priest', value: 'Priest' },
        { label: 'Shaman', value: 'Shaman' },
        { label: 'Mage', value: 'Mage' },
        { label: 'Warlock', value: 'Warlock' },
        { label: 'Monk', value: 'Monk' },
        { label: 'Druid', value: 'Druid' },
        { label: 'Demon Hunter', value: 'Demon Hunter' },
        { label: 'Death Knight', value: 'Death Knight' },
    ];

    isChecked: boolean;
    amount: number;
    totalPot: number;
    discount: number;

    realms: Array<SelectItem> = [];

    constructor(activatedRoute: ActivatedRoute) {
        this.context = activatedRoute.snapshot.data.data.context;
        this.realms = this.context.realms.map(realm => ({ label: realm.name, value: realm }));
    }

    addPaymentRow(): void {
        this.payments.push({ amount: 0, realm: '' });
    }

    removePaymentRow(payment: any): void {
        this.payments = this.payments.filter((item) => item !== payment);
    }

    addKeyRow(): void {
        this.keys.push({
            key: 'Any',
            userId: '543556245437343244',
            role: 'Tank',
        });
    }

    removeKeyRow(key: any): void {
        this.keys = this.keys.filter((item) => item !== key);
    }

    update(payment: any): void {
        console.log(payment);
        // this.payments.find(item => item === payment).amount
    }

    onChange(): void {
        this.totalPot =
            this.amount - ((this.amount * 100) / 100) * this.discount;
    }

    total(): void {
        this.totalPot = this.payments.reduce(
            (sum, current) => sum + current.amount,
            0
        );
    }
}
