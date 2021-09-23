import { Component, OnDestroy } from '@angular/core';
import { StaffListGroup, StaffListModel } from './staff-list.model';
import { Unsubscribable } from 'rxjs';
import { StaffListService } from './staff-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TableActionResponse, TableHeader, TableRow } from '../../../../../shared/components/table/table.model';
import { UserAction } from '../../../../../shared/constants/common.interfaces';
import { SiteNotificationService } from '../../../../../core/common-services/site-notification.service';
import { SiteNotificationType } from '../../../../../shared/app-views/site-notification/site-notification.interface';
import { CombineSubscriptions } from 'src/app/shared/decorators/unsub.decorator';

@Component({
    selector: 'app-admin-website-settings-staff-list',
    templateUrl: 'staff-list.component.html',
    styleUrls: ['staff-list.component.css']
})
export class StaffListComponent implements OnDestroy {
    private readonly ACTIONS = {
        SAVE: 'save',
        GO_BACK: 'go_back',
        MOVE_UP: 'move_up',
        MOVE_DOWN: 'move_down',
        REMOVE: 'remove'
    };
    data = {} as StaffListModel;

    contentActions: Array<UserAction> = [
        {label: 'Save', value: this.ACTIONS.SAVE},
        {label: 'Go back', value: this.ACTIONS.GO_BACK}
    ];
    selectedGroup: StaffListGroup = null;
    selectableGroups: Array<StaffListGroup> = [];
    selectedGroups: Array<StaffListGroup> = [];
    @CombineSubscriptions()
    subscriber: Unsubscribable;
    rows: Array<TableRow> = [];
    headers: Array<TableHeader> = [
        {label: 'Name'},
        {label: 'Display order'}
    ];

    constructor(
        private router: Router,
        private service: StaffListService,
        private siteNotificationService: SiteNotificationService,
        activatedRoute: ActivatedRoute
    ) {
        this.subscriber = activatedRoute.data.subscribe(this.onData.bind(this));
    }

    ngOnDestroy(): void {
        // Empty
    }

    async onContentAction(action: UserAction): Promise<void> {
        switch (action.value) {
            case this.ACTIONS.GO_BACK:
                this.router.navigateByUrl('/admin/website-settings/list');
                break;
            case this.ACTIONS.SAVE:
                this.data.groups = this.selectedGroups.concat(this.selectableGroups);
                await this.service.save(this.data);
        }
    }

    onAction(action: TableActionResponse): void {
        switch (action.action.value) {
            case this.ACTIONS.MOVE_UP:
                this.onMoveUp(Number(action.row.rowId));
                break;
            case this.ACTIONS.MOVE_DOWN:
                this.onMoveDown(Number(action.row.rowId));
                break;
            case this.ACTIONS.REMOVE:
                this.onRemoveGroup(Number(action.row.rowId));
                break;
        }
    }

    addGroup(): void {
        if (!this.selectedGroup) {
            this.siteNotificationService.create({
                title: 'No group',
                message: 'No group selected to add',
                type: SiteNotificationType.ERROR
            });
            return;
        }
        this.selectedGroup.isSelected = true;
        this.selectedGroup.displayOrder = this.selectedGroups.length > 0 ?
            this.selectedGroups[this.selectedGroups.length - 1].displayOrder + 1 : 1;
        this.selectedGroups.push(this.selectedGroup);
        this.selectedGroup = null;

        this.selectableGroups = this.getSelectableGroups();
        this.rows = this.getRows(this.selectedGroups);
    }

    private onMoveUp(groupId: number): void {
        const currentIndex = this.selectedGroups.findIndex(item => item.groupId === groupId);
        if (currentIndex === 0) {
            return;
        }

        const group = this.selectedGroups[currentIndex];
        const groupAbove = this.selectedGroups[currentIndex - 1];
        const groupAboveDisplayOrder = groupAbove.displayOrder;
        groupAbove.displayOrder = group.displayOrder;
        group.displayOrder = groupAboveDisplayOrder;
        this.selectedGroups.sort((a, b) => a.displayOrder > b.displayOrder ? 1 : -1);
        this.rows = this.getRows(this.selectedGroups);
    }

    private onMoveDown(groupId: number): void {
        const currentIndex = this.selectedGroups.findIndex(item => item.groupId === groupId);
        if (currentIndex === (this.selectedGroups.length - 1)) {
            return;
        }

        const group = this.selectedGroups[currentIndex];
        const groupBelow = this.selectedGroups[currentIndex + 1];
        const groupBelowDisplayOrder = groupBelow.displayOrder;
        groupBelow.displayOrder = group.displayOrder;
        group.displayOrder = groupBelowDisplayOrder;
        this.selectedGroups.sort((a, b) => a.displayOrder > b.displayOrder ? 1 : -1);
        this.rows = this.getRows(this.selectedGroups);
    }

    private onRemoveGroup(groupId: number): void {
        const group = this.selectedGroups.find(item => item.groupId === groupId);
        group.isSelected = false;

        this.selectableGroups = this.getSelectableGroups();
        this.selectedGroups = this.getSelectedGroups();
        this.rows = this.getRows(this.selectedGroups);
    }

    private onData({data}: { data: StaffListModel }): void {
        this.data = data;
        this.selectableGroups = this.getSelectableGroups();
        this.selectedGroups = this.getSelectedGroups();
        this.rows = this.getRows(this.selectedGroups);
    }

    private getRows(groups: Array<StaffListGroup>): Array<TableRow> {
        return groups.filter(group => group.isSelected)
            .sort((a, b) => a.displayOrder > b.displayOrder ? 1 : -1)
            .map(group => ({
                rowId: group.groupId,
                cells: [
                    {label: group.name},
                    {label: group.displayOrder}
                ],
                actions: [
                    {label: 'Move up', value: this.ACTIONS.MOVE_UP},
                    {label: 'Move down', value: this.ACTIONS.MOVE_DOWN},
                    {label: 'Remove', value: this.ACTIONS.REMOVE}
                ]
            }));
    }

    private getSelectedGroups(): Array<StaffListGroup> {
        const groups = this.data.groups.filter(group => group.isSelected)
            .sort((a, b) => a.displayOrder > b.displayOrder ? 1 : -1);
        groups.forEach((group, index) => group.displayOrder = index + 1);
        return groups;
    }

    private getSelectableGroups(): Array<StaffListGroup> {
        return this.data.groups.filter(group => !group.isSelected)
            .sort((a, b) => a.name > b.name ? 1 : -1);
    }
}
