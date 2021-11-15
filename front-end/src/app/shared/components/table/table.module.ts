import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from './table.component';
import { ContentModule } from '../content/content.module';
import { DialogTableComponent } from './dialog-table.component';
import { PaginationModule } from '../pagination/pagination.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ContentModule,
        PaginationModule
    ],
    declarations: [
        TableComponent,
        DialogTableComponent
    ],
    exports: [
        TableComponent,
        DialogTableComponent
    ]
})
export class TableModule {
}
