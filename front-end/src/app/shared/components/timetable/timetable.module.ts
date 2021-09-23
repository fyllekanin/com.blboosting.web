import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimetableService } from './timetable.service';
import { TimetableComponent } from './timetable.component';
import { ContentModule } from '../content/content.module';
import { DetailedSlotComponent } from './detailed-slot/detailed-slot.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ContentModule
    ],
    declarations: [
        TimetableComponent,
        DetailedSlotComponent
    ],
    providers: [
        TimetableService
    ],
    exports: [
        TimetableComponent
    ]
})
export class TimetableModule {
}
