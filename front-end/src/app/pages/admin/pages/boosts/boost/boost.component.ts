import { Component } from '@angular/core';
import { BoostContext, IBoost, IBooster, IBoostKey, IBoostPayment } from '../boosts.interface';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from '../../../../../shared/components/form/select/select.interface';
import { UserAction } from '../../../../../shared/constants/common.interfaces';
import { ColorValue } from '../../../../../shared/constants/colors.constants';
import { DialogService } from '../../../../../core/common-services/dialog.service';

@Component({
    selector: 'app-admin-boosts-boost',
    templateUrl: 'boost.component.html',
    styleUrls: ['boost.component.scss'],
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
            armor: {
                cloth: false,
                leather: false,
                mail: false,
                plate: false
            },
            class: {
                warrior: false,
                paladin: false,
                hunter: false,
                rogue: false,
                priest: false,
                shaman: false,
                mage: false,
                warlock: false,
                monk: false,
                druid: false,
                demonHunter: false,
                deathKnight: false
            }
        },
        playAlong: {
            name: null,
            realm: null,
            role: null
        },
        keys: [{
            level: 0,
            dungeon: null,
            isTimed: false,
            keyHolder: { user: null, role: null },
            availableBoosters: []
        }],
        payments: [{ realm: null, amount: 0, faction: null }]
    };

    actions: Array<UserAction> = [
        { label: 'Save', color: ColorValue.GREEN, value: 'save' },
        { label: 'Back', color: ColorValue.BLUE, link: '/admin/boosts/page/1' }
    ];

    realms: Array<SelectItem> = [];
    factions: Array<SelectItem> = [];
    sources: Array<SelectItem> = [];
    roles: Array<SelectItem> = [];
    dungeons: Array<SelectItem> = [];

    constructor(
        private dialogService: DialogService,
        activatedRoute: ActivatedRoute
    ) {
        this.context = activatedRoute.snapshot.data.data.context;
        this.realms = this.context.realms.map(realm => ({ label: realm.name, value: realm }));
        this.factions = this.context.factions.map(faction => ({ label: faction, value: faction }));
        this.sources = this.context.sources.map(source => ({ label: source, value: source }));
        this.roles = this.context.roles.map(role => ({ label: role, value: role }));
        this.dungeons = this.context.dungeons.map(dungeon => ({ label: dungeon, value: dungeon }));

        this.entity.keys[0].availableBoosters = this.context.boosters.low.map(booster => ({
            label: booster.name,
            value: booster.discordId
        }));
    }

    async onAction(action: UserAction): Promise<void> {
        if (action.value === 'save') {
            // Do something
        }
    }

    updateApplicableBoosters(): void {
        this.entity.keys.forEach(key => key.availableBoosters = this.getAvailableBoosters(key));
    }

    onKeyChange(item: IBoostKey): void {
        item.availableBoosters = this.getAvailableBoosters(item);
        if (!item.availableBoosters.every(booster => booster.value !== item.keyHolder.user.value)) {
            item.keyHolder.user = null;
        }
    }

    onAddPaymentRow(index: number): void {
        if (this.entity.payments.length >= 4) {
            return;
        }
        this.entity.payments.splice((index + 2) - 1, 0, { realm: null, amount: 0, faction: null });
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
        this.entity.keys.splice((index + 2) - 1, 0, {
            level: 0,
            dungeon: null,
            isTimed: false,
            availableBoosters: this.context.boosters.low.map(booster => ({
                label: booster.name,
                value: booster.discordId
            })),
            keyHolder: { user: null, role: null }
        });
    }

    onRemoveKeyRow(key: IBoostKey): void {
        if (this.entity.keys.length === 1) {
            return;
        }
        this.entity.keys = this.entity.keys.filter(item => item !== key);
    }

    private getAvailableBoosters(item: IBoostKey): Array<SelectItem> {
        let boosters: Array<IBooster> = this.context.boosters.low;
        if (item.isTimed && item.level >= 16) {
            boosters = this.context.boosters.elite;
        }
        if (item.isTimed && item.level >= 15) {
            boosters = this.context.boosters.high;
        }
        if ((item.isTimed && item.level >= 10) || item.level > 10) {
            boosters = this.context.boosters.medium;
        }

        boosters = this.getApplicableArmors(boosters);
        boosters = this.getApplicableClasses(boosters);

        return boosters.map(booster => ({
            label: booster.name,
            value: booster.discordId
        }));
    }

    private getApplicableArmors(boosters: Array<IBooster>): Array<IBooster> {
        const activeArmors = Object.keys(this.entity.boost.armor).filter(key => this.entity.boost.armor[key]);
        if (activeArmors.length === 0) {
            return boosters;
        }
        return boosters.filter(booster => {
            const boosterArmors = Object.keys(booster.armors).filter(key => booster.armors[key]);
            return activeArmors.some(key => boosterArmors.includes(key));
        });
    }

    private getApplicableClasses(boosters: Array<IBooster>): Array<IBooster> {
        const activeClasses = Object.keys(this.entity.boost.class).filter(key => this.entity.boost.class[key]);
        if (activeClasses.length === 0) {
            return boosters;
        }
        return boosters.filter(booster => {
            const boosterClasses = Object.keys(booster.classes).filter(key => booster.classes[key]);
            return activeClasses.some(key => boosterClasses.includes(key));
        });
    }
}
