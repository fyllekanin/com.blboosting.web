import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Unsubscribable } from 'rxjs';
import { TableActionResponse, TableHeader, TableRow } from '../../../../../shared/components/table/table.model';
import { TimetableEvent } from '../../../../../shared/components/timetable/timetable.interface';
import { TimeHelper } from '../../../../../shared/helpers/time.helper';
import { ManageEventsService } from './manage-events.service';
import { DialogService } from '../../../../../core/common-services/dialog.service';
import { CombineSubscriptions } from 'src/app/shared/decorators/unsub.decorator';

@Component({
    selector: 'app-staff-events-manage',
    templateUrl: 'manage-events.component.html'
})
export class ManageEventsComponent {

    data: Array<TimetableEvent> = [];
    contentActions = [ { label: 'Create new', value: 'createNew' } ];
    @CombineSubscriptions()
    subscriber: Unsubscribable;
    rows: Array<TableRow> = [];
    headers: Array<TableHeader> = [
        { label: 'Event' },
        { label: 'Created at' }
    ];

    constructor (
        private service: ManageEventsService,
        private dialogService: DialogService,
        activatedRoute: ActivatedRoute
    ) {
        this.subscriber = activatedRoute.data.subscribe(this.onData.bind(this));
    }

    async onCreateNew (): Promise<void> {
        const name = await this.service.createEvent();
        if (!name) {
            return;
        }
        await this.service.create(name);
        this.onData({ data: await this.service.resolve().toPromise() });
    }

    async onDelete (row: TableActionResponse): Promise<void> {
        const confirmed = await this.dialogService.confirm('Are you sure you wanna delete this event?');
        if (confirmed) {
            await this.service.delete(row.row.rowId as number);
            this.data = this.data.filter(event => event.eventId !== row.row.rowId);
            this.rows = this.getRows();
        }
    }

    private onData ({ data }: { data: Array<TimetableEvent> }): void {
        this.data = data;
        this.rows = this.getRows();
    }

    private getRows (): Array<TableRow> {
        return this.data.map(item => ({
            rowId: item.eventId,
            actions: [
                {
                    label: 'Delete',
                    value: 'delete'
                }
            ],
            cells: [
                { label: item.name },
                { label: TimeHelper.getLongDateWithTime(item.createdAt) }
            ]
        }));
    }
}
