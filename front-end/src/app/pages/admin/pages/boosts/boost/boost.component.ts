import { Component } from '@angular/core';
import { BoostContext, IBoost, IBooster, IBoostKey, IBoostPayment } from '../boosts.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from '../../../../../shared/components/form/select/select.interface';
import { UserAction } from '../../../../../shared/constants/common.interfaces';
import { ButtonClasses } from '../../../../../shared/constants/button.constants';
import { BoostService } from './boost.service';
import { DialogService } from '../../../../../core/common-services/dialog.service';
import { DialogTableComponent } from '../../../../../shared/components/table/dialog-table.component';
import { first } from 'rxjs';
import { IPagination } from '../../../../../shared/components/pagination/pagination.interface';

@Component({
    selector: 'app-admin-boosts-boost',
    templateUrl: 'boost.component.html',
    styleUrls: ['boost.component.scss'],
})
export class BoostComponent {
    private dialogComponent: DialogTableComponent<IBooster>;
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
            keyHolder: { user: null, role: null }
        }],
        payments: [{ realm: null, amount: null, faction: null, isMandatory: false }]
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

    async onSelectBooster(boostKey: IBoostKey): Promise<void> {
        this.dialogService.onComponentInstance.pipe(first()).subscribe(async componentRef => {
            this.dialogComponent = (<DialogTableComponent<IBooster>>componentRef.instance);
            this.dialogComponent.onPageChange = this.setDialogData.bind(this);
            this.dialogComponent.onSearchChange = this.setDialogData.bind(this);
            this.dialogComponent.headers = [{ label: 'Name' }, { label: 'Discord ID' }];
            this.dialogComponent.onPageChange(1);

            this.dialogComponent.onSelectRow = rowId => {
                boostKey.keyHolder.user = {
                    label: this.dialogComponent.pagination.items.find(item => item.discordId === rowId).name,
                    value: rowId
                };
                this.dialogService.close();
            };
        });
        this.dialogService.open({
            component: DialogTableComponent,
            title: 'Booster',
            buttons: [
                { label: 'Close', action: 'close', type: 'button-gray', isClosing: true }
            ]
        });
        this.dialogService.onAction.pipe(first()).subscribe(() => this.dialogService.close());
    }

    onPaymentChange(item: IBoostPayment): void {
        item.isMandatory = Boolean(item.realm || item.amount || item.faction || item.collector)
    }

    onKeyChange(item: IBoostKey): void {
        if (item.dungeon.value.value === 'TAZ' || (item.level && item.level.value === 0)) {
            item.isTimed = false;
            item.isTimedDisabled = true;
        } else {
            item.isTimedDisabled = false;
        }

        this.isMultipleSpecifics = this.entity.keys.filter(key => key.dungeon.value.value !== 'ANY').length > 1;
        if (!item.keyHolder.user) {
            return;
        }
        if (!item.keyHolder) {
            item.keyHolder.user = null;
        }
    }

    onAddPaymentRow(index: number): void {
        this.entity.payments.splice((index + 2) - 1, 0, {
            realm: null,
            amount: null,
            faction: null,
            isMandatory: false
        });
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
            keyHolder: { user: null, role: null }
        });
    }

    onRemoveKeyRow(key: IBoostKey): void {
        if (this.entity.keys.length === 1) {
            return;
        }
        this.entity.keys = this.entity.keys.filter(item => item !== key);
    }

    private async setDialogData(): Promise<void> {
        const armors = Object.keys(this.entity.boost.armor).filter(key => this.entity.boost.armor[key]).map(key => key);
        const classes = Object.keys(this.entity.boost.class).filter(key => this.entity.boost.class[key]).map(key => key);
        const data: IPagination<IBooster> = await this.boostService.getBoosters(1, {
            name: this.dialogComponent.search,
            armors: armors,
            classes: classes
        });
        this.dialogComponent.pagination = data;
        this.dialogComponent.rows = data.items.map(item => ({
            rowId: item.discordId,
            actions: [{
                label: 'Select',
                buttonClass: ButtonClasses.BLUE
            }],
            cells: [
                { label: item.name },
                { label: item.discordId }
            ]
        }));
    }
}
