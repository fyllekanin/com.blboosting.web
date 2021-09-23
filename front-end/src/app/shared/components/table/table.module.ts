import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from './table.component';
import { ContentModule } from '../content/content.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ContentModule
    ],
    declarations: [
        TableComponent
    ],
    exports: [
        TableComponent
    ]
})
export class TableModule {
}
