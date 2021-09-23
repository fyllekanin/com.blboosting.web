import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableActionResponse, TableHeader, TableRow } from './table.model';

@Component({
    selector: 'app-table',
    templateUrl: 'table.component.html',
    styleUrls: [ 'table.component.css' ]
})
export class TableComponent {
    private myRows: Array<TableRow> = [];


    @Input() headers: Array<TableHeader> = [];
    @Output() onAction: EventEmitter<TableActionResponse> = new EventEmitter();
    doAnyRowHaveActions = false;

    @Input()
    set rows (rows: Array<TableRow>) {
        this.myRows = rows;
        this.myRows.forEach(row => row.actions = row.actions.filter(action => !action.isHidden));
        this.doAnyRowHaveActions = this.myRows.some(row => Array.isArray(row.actions) && row.actions.length > 0);
    }

    get rows (): Array<TableRow> {
        return this.myRows;
    }

    onOpenAction (e): void {
        e.preventDefault();
    }
}
