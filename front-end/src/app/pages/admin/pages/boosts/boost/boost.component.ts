import { Component } from '@angular/core';
import { BoostContext, IBoost, IBooster, IBoostKey, IBoostPayment } from '../boosts.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from '../../../../../shared/components/form/select/select.interface';
import { UserAction } from '../../../../../shared/constants/common.interfaces';
import { ButtonClasses } from '../../../../../shared/constants/button.constants';
import { BoostService } from './boost.service';
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
            discount: null,
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
            isPlaying: false,
            role: null
        },
        keys: [{
            level: null,
            dungeon: null,
            isTimed: false,
            keyHolder: { user: null, role: null },
            availableBoosters: []
        }],
        payments: [{ realm: null, amount: null, faction: null }]
    };

    actions: Array<UserAction> = [
        { label: 'Submit', buttonClass: ButtonClasses.GREEN, value: 'submit' },
        { label: 'Back', buttonClass: ButtonClasses.BLUE, link: '/admin/boosts/page/1' }
    ];

    realms: Array<SelectItem> = [];
    dungeons: Array<SelectItem> = [];
    isMultipleSpecifics = false;

    constructor(
        private boostService: BoostService,
        private router: Router,
        private dialogService: DialogService,
        activatedRoute: ActivatedRoute
    ) {
        this.context = activatedRoute.snapshot.data.data.context;
        this.realms = this.context.realms.map(realm => ({ label: realm.name, value: realm }));
        this.dungeons = this.context.dungeons.map(dungeon => ({ label: dungeon.name, value: dungeon }));

        this.entity.keys[0].availableBoosters = this.context.boosters.low.map(booster => ({
            label: booster.name,
            value: booster.discordId
        }));
    }

    async onAction(action: UserAction): Promise<void> {
        if (action.value === 'submit') {
            this.dialogService.confirm('Are you sure that you wanna post this boost?').then(async answer => {
                if (!answer) {
                    return;
                }
                const isSuccess = await this.boostService.submitBoost(this.entity);
                if (isSuccess) {
                    await this.router.navigateByUrl('/admin/boosts/page/1');
                }
            });
        }
    }

    updateApplicableBoosters(): void {
        this.entity.keys.forEach(key => key.availableBoosters = this.getAvailableBoosters(key));
    }

    onKeyChange(item: IBoostKey): void {
        if (item.dungeon.value.value === 'TAZ' || (item.level && item.level.value === 0)) {
            item.isTimed = false;
            item.isTimedDisabled = true;
        } else {
            item.isTimedDisabled = false;
        }

        this.isMultipleSpecifics = this.entity.keys.filter(key => key.dungeon.value.value !== 'ANY').length > 1;
        item.availableBoosters = this.getAvailableBoosters(item);
        if (!item.keyHolder.user) {
            return;
        }
        if (!item.keyHolder || !item.availableBoosters.every(booster => booster.value.discordId !== item.keyHolder.user.value.discordId)) {
            item.keyHolder.user = null;
        }
    }

    onAddPaymentRow(index: number): void {
        this.entity.payments.splice((index + 2) - 1, 0, { realm: null, amount: null, faction: null });
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
            level: null,
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
        if (item.dungeon && item.dungeon.value.value === 'TAZ') {
            boosters = this.context.boosters.high;
        } else if (item.dungeon && item.level) {
            if (item.isTimed && item.level.value >= 16) {
                boosters = this.context.boosters.elite;
            }
            if (item.isTimed && item.level.value >= 15) {
                boosters = this.context.boosters.high;
            }
            if ((item.isTimed && item.level.value >= 10) || item.level.value > 10) {
                boosters = this.context.boosters.medium;
            }
        }

        return this.getApplicableArmorsAndClasses(boosters).map(booster => ({
            label: booster.name,
            value: booster
        }));
    }

    private getApplicableArmorsAndClasses(boosters: Array<IBooster>): Array<IBooster> {
        const activeArmors = Object.keys(this.entity.boost.armor).filter(key => this.entity.boost.armor[key]);
        const activeClasses = Object.keys(this.entity.boost.class).filter(key => this.entity.boost.class[key]);
        if (activeClasses.length === 0 && activeArmors.length === 0) {
            return boosters;
        }
        return boosters.filter(booster => {
            const boosterClasses = Object.keys(booster.classes).filter(key => booster.classes[key]);
            const boosterArmors = Object.keys(booster.armors).filter(key => booster.armors[key]);
            return activeClasses.some(key => boosterClasses.includes(key)) || activeArmors.some(key => boosterArmors.includes(key));
            ;
        });
    }
}
