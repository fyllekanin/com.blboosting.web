import { DialogService } from './../../../../../../core/common-services/dialog.service';
import { Component, OnDestroy } from '@angular/core';
import { TableActionResponse, TableHeader, TableRow } from '../../../../../../shared/components/table/table.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CombineSubscriptions, UnSub } from '../../../../../../shared/decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';
import { BbcodeClass } from '../../../../../../shared/classes/bbcode.class';
import { TimeHelper } from '../../../../../../shared/helpers/time.helper';
import { UserAction } from '../../../../../../shared/constants/common.interfaces';
import { BbcodeService } from '../bbcode/bbcode.service';

@Component({
    selector: 'app-admin-website-settings-bbcode-list',
    templateUrl: 'bbcode-list.component.html'
})
@UnSub()
export class BbcodeListComponent implements OnDestroy {
    private readonly ACTIONS = {
        EDIT: 'edit',
        DELETE: 'delete'
    };
    headers: Array<TableHeader> = [
        {label: 'Name'},
        {label: 'Example'},
        {label: 'Last modified'}
    ];
    contentActions: Array<UserAction> = [{label: 'Create', value: 'create'}];
    @CombineSubscriptions()
    subscriber: Unsubscribable;
    editableTableRows: Array<TableRow> = [];
    systemTableRows: Array<TableRow> = [];

    constructor (
        private dialogService: DialogService,
        private bbcodeService: BbcodeService,
        private router: Router,
        activatedRoute: ActivatedRoute
    ) {
        this.subscriber = activatedRoute.data.subscribe(this.onData.bind(this));
    }

    ngOnDestroy () {
        // Empty
    }

    onCreateNew (): void {
        this.router.navigateByUrl('/admin/website-settings/bbcodes/new');
    }

    async onAction (action: TableActionResponse): Promise<void> {
        switch (action.action.value) {
            case this.ACTIONS.EDIT:
                await this.router.navigateByUrl(`/admin/website-settings/bbcodes/${action.row.rowId}`);
                break;
            case this.ACTIONS.DELETE:
                const answer = await this.dialogService.confirm('Do you really wanna delete this bbcode?');
                if (answer) {
                    await this.bbcodeService.delete(action.row.rowId as number);
                    this.editableTableRows = this.editableTableRows.filter(row => row.rowId === action.row.rowId);
                }
                break;
        }
    }

    private onData ({data}: { data: Array<BbcodeClass> }): void {
        this.editableTableRows = this.getRows(data.filter(bbcode => !bbcode.isSystem), true);
        this.systemTableRows = this.getRows(data.filter(bbcode => bbcode.isSystem), false);
    }

    private getRows (bbcodes: Array<BbcodeClass>, doHaveActions: boolean): Array<TableRow> {
        return bbcodes.map(bbcode => ({
            rowId: bbcode.bbcodeId,
            cells: [
                {label: bbcode.name},
                {label: bbcode.example},
                {label: TimeHelper.getLongDateWithTime(bbcode.updatedAt)}
            ],
            actions: doHaveActions ? [
                {label: 'Edit', value: this.ACTIONS.EDIT},
                {label: 'Delete', value: this.ACTIONS.DELETE}
            ] : []
        }));
    }
}
