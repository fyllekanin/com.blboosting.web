import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableActionResponse, TableFilters, TableHeader, TableRow } from './table.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-table',
    templateUrl: 'table.component.html',
    styleUrls: ['table.component.scss']
})
export class TableComponent {
    private myRows: Array<TableRow> = [];
    private myFilters: TableFilters;
    private myTimeout: any;


    @Input() headers: Array<TableHeader> = [];
    @Output() actionChange: EventEmitter<TableActionResponse> = new EventEmitter();
    doAnyRowHaveActions = false;
    filterValues: { [key: string]: string } = {};

    constructor(private router: Router, activatedRoute: ActivatedRoute) {
        debugger;
        this.filterValues = { ...activatedRoute.snapshot.queryParams };
    }

    @Input()
    set filters(filter: TableFilters) {
        this.myFilters = filter;
    }

    get filters(): TableFilters {
        return this.myFilters;
    }

    @Input()
    set rows(rows: Array<TableRow>) {
        this.myRows = rows;
        this.myRows.forEach(row => row.actions = row.actions.filter(action => !action.isHidden));
        this.doAnyRowHaveActions = this.myRows.some(row => Array.isArray(row.actions) && row.actions.length > 0);
    }

    get rows(): Array<TableRow> {
        return this.myRows;
    }

    onOpenAction(e): void {
        e.preventDefault();
    }

    async onFilterChange(): Promise<void> {
        if (this.myTimeout) {
            clearTimeout(this.myTimeout);
        }
        this.myTimeout = setTimeout(async () => {
            await this.router.navigate([this.myFilters.path], {
                queryParams: this.myFilters.filters.reduce((prev, curr) => {
                    if (this.filterValues[curr.queryName]) {
                        prev[curr.queryName] = this.filterValues[curr.queryName];
                    }
                    return prev;
                }, {})
            })
        }, 200);
    }
}
