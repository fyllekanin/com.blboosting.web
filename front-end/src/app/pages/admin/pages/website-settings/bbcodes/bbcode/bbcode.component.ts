import { DialogService } from './../../../../../../core/common-services/dialog.service';
import { BbcodeClass } from './../../../../../../shared/classes/bbcode.class';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { BbcodeService } from './bbcode.service';
import { Unsubscribable } from 'rxjs';
import { CombineSubscriptions, UnSub } from 'src/app/shared/decorators/unsub.decorator';
import { UserAction } from 'src/app/shared/constants/common.interfaces';
import { GlobalBbcodeService } from 'src/app/core/common-services/global-bbcode.service';

@Component({
    selector: 'app-admin-website-settings-bbcodes-bbcode',
    templateUrl: 'bbcode.component.html'
})
@UnSub()
export class BbcodeComponent implements OnDestroy {
    private readonly ACTIONS = {
        SAVE: 'save',
        DELETE: 'delete',
        BACK: 'back'
    };
    contentActions: Array<UserAction> = [];
    data = {} as BbcodeClass;
    @CombineSubscriptions()
    subscriber: Unsubscribable;

    constructor(
        private globalBbcodeService: GlobalBbcodeService,
        private bbcodeService: BbcodeService,
        private router: Router,
        private dialogService: DialogService,
        activatedRoute: ActivatedRoute
    ) {
        this.subscriber = activatedRoute.data.subscribe(this.onData.bind(this));
    }

    ngOnDestroy(): void {
        // Empty
    }

    async onAction(action: UserAction): Promise<void> {
        switch (action.value) {
            case this.ACTIONS.SAVE:
                this.data.bbcodeId = await this.bbcodeService.create(this.data) as number;
                this.globalBbcodeService.clearCache();
                this.contentActions = this.getActions();
                break;
            case this.ACTIONS.DELETE:
                const answer = await this.dialogService.confirm('Do you really wanna delete this bbcode?');
                if (answer) {
                    await this.bbcodeService.delete(this.data.bbcodeId);
                    await this.router.navigateByUrl('/admin/website-settings/bbcodes');
                }
                break;
            case this.ACTIONS.BACK:
                await this.router.navigateByUrl('/admin/website-settings/bbcodes');
                break;
        }
    }

    private onData({data}: { data: BbcodeClass }): void {
        this.data = data;
        this.contentActions = this.getActions();
    }

    private getActions(): Array<UserAction> {
        return [
            {label: 'Save', value: this.ACTIONS.SAVE, isHidden: false},
            {label: 'Delete', value: this.ACTIONS.DELETE, isHidden: !this.data.bbcodeId},
            {label: 'Go back', value: this.ACTIONS.BACK, isHidden: false}
        ];
    }
}
