export interface TableHeader {
    label: string;
}

export interface TableCell {
    label: string | number;
}

export interface TableRow {
    rowId: number | string;
    cells: Array<TableCell>;
}

export interface TableActionResponse {
    row: TableRow;
}
