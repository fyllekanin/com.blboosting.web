import { UserAction } from '../../constants/common.interfaces';

export interface TableHeader {
    label: string;
}

export interface TableCell {
    label: string | number;
}

export interface TableRow {
    rowId: number | string;
    cells: Array<TableCell>;
    actions?: Array<UserAction>;
}

export interface TableActionResponse {
    row: TableRow;
    action: UserAction;
}

export interface TableFilter {
    placeholder: string;
    queryName: string;
    type: 'string';
}

export interface TableFilters {
    filters: Array<TableFilter>;
    path: string;
}
