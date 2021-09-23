import { NgModule } from '@angular/core';
import { SlideShowComponent } from './slide-show.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        SlideShowComponent
    ],
    providers: [],
    exports: [
        SlideShowComponent
    ]
})
export class SlideShowModule {
}
