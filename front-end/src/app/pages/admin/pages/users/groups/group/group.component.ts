import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CombineSubscriptions, UnSub } from '../../../../../../shared/decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';
import { UserAction } from '../../../../../../shared/constants/common.interfaces';
import { DialogService } from '../../../../../../core/common-services/dialog.service';
import { GroupService } from './group.service';
import { GroupClass } from '../../../../../../shared/classes/admin/group.class';
import { AuthService } from '../../../../../../core/auth/auth.service';
import { AuthUser } from '../../../../../../core/auth/auth-user.model';

@Component({
    selector: 'app-admin-users-groups-group',
    templateUrl: 'group.component.html',
    styleUrls: ['group.component.css']
})
@UnSub()
export class GroupComponent implements OnDestroy {
    private readonly ACTIONS = {
        SAVE: 'save',
        DELETE: 'delete',
        BACK: 'back'
    };
    actions: Array<UserAction> = [];
    data = {} as GroupClass;

    @CombineSubscriptions()
    subscriber: Unsubscribable;

    constructor(
        private service: GroupService,
        private router: Router,
        private dialogService: DialogService,
        private authService: AuthService,
        activatedRoute: ActivatedRoute
    ) {
        this.subscriber = activatedRoute.data.subscribe(this.onData.bind(this));
    }

    ngOnDestroy(): void {
        // Empty
    }

    async onAction(action: UserAction): Promise<void> {
        switch (action.value) {
            case this.ACTIONS.BACK:
                await this.router.navigateByUrl('/admin/users/groups/page/1');
                break;
            case this.ACTIONS.SAVE:
                await this.onSave();
                break;
            case this.ACTIONS.DELETE:
                await this.onDelete();
                break;
        }
    }

    get authUser(): AuthUser {
        return this.authService.getAuthUser();
    }

    private async onSave(): Promise<void> {
        const groupId = await this.service.save(this.data);
        this.data.groupId = groupId as number;
        this.actions = this.getActions();
    }

    private async onDelete(): Promise<void> {
        const confirmed = await this.dialogService.confirm('Do you really wanna delete this group?');
        if (confirmed) {
            await this.service.delete(this.data.groupId);
            await this.router.navigateByUrl('/admin/users/groups/page/1');
        }
    }

    private onData({data}: { data: GroupClass }): void {
        this.data = data;
        this.actions = this.getActions();
    }

    private getActions(): Array<UserAction> {
        return [
            {label: 'Save', value: this.ACTIONS.SAVE, isAvailable: true},
            {label: 'Delete', value: this.ACTIONS.DELETE, isAvailable: Boolean(this.data.groupId)},
            {label: 'Go back', value: this.ACTIONS.BACK, isAvailable: true}
        ].filter(action => action.isAvailable).map(action => {
            delete action.isAvailable;
            return action;
        });
    }
}
