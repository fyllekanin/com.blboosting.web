import { Component } from '@angular/core';
import { Unsubscribable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SlimUserGroup, UserGroupsModel } from './user-groups.model';
import { UserAction } from '../../../../../../shared/constants/common.interfaces';
import { UserGroupsService } from './user-groups.service';
import { CombineSubscriptions } from 'src/app/shared/decorators/unsub.decorator';

@Component({
    selector: 'app-admin-users-users-groups',
    templateUrl: 'user-groups.component.html'
})
export class UserGroupsComponent {
    private readonly ACTIONS = {
        SAVE: 'save',
        GO_BACK: 'go_back'
    };
    data = {} as UserGroupsModel;
    @CombineSubscriptions()
    subscriber: Unsubscribable;
    possibleDisplayGroups: Array<SlimUserGroup> = [];
    contentActions: Array<UserAction> = [
        {
            label: 'Save',
            value: this.ACTIONS.SAVE
        },
        {
            label: 'Go back',
            value: this.ACTIONS.GO_BACK
        }
    ];

    constructor(
        private router: Router,
        private service: UserGroupsService,
        activatedRoute: ActivatedRoute
    ) {
        this.subscriber = activatedRoute.data.subscribe(this.onData.bind(this));
    }

    async onAction(action: UserAction): Promise<void> {
        switch (action.value) {
            case this.ACTIONS.SAVE:
                await this.service.save(this.data);
                break;
            case this.ACTIONS.GO_BACK:
                this.router.navigateByUrl('/admin/users/users/page/1');
                break;
        }
    }

    onChange(): void {
        this.possibleDisplayGroups = this.getPossibleDisplayGroups();
        this.data.displayGroupId = this.possibleDisplayGroups
            .some(group => group.groupId === this.data.displayGroupId) ?
            this.data.displayGroupId : null;
    }

    private onData({data}: { data: UserGroupsModel }): void {
        this.data = data;
        this.possibleDisplayGroups = this.getPossibleDisplayGroups();
    }

    private getPossibleDisplayGroups(): Array<SlimUserGroup> {
        return this.data.groups.filter(group => group.isSelected);
    }
}
