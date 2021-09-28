import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentModule } from '../../../../shared/components/content/content.module';
import { BoostComponent } from './boost/boost.component';

@NgModule({
    imports: [
        CommonModule,
        ContentModule
    ],
    declarations: [
        BoostComponent
    ],
    exports: [
        BoostComponent
    ]
})
export class BoostsModule {
}
