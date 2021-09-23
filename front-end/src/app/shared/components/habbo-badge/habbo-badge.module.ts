import { NgModule } from '@angular/core';
import { HabboBadgeDirective } from './habbo-badge.directive';
import { HabboBadgeComponent } from './habbo-badge.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        HabboBadgeDirective,
        HabboBadgeComponent
    ],
    exports: [
        HabboBadgeDirective,
        HabboBadgeComponent
    ]
})
export class HabboBadgeModule {
}
