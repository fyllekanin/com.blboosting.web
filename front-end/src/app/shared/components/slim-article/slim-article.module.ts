import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HabboBadgeModule } from '../habbo-badge/habbo-badge.module';
import { SlimArticleComponent } from './slim-article.component';

@NgModule({
    imports: [
        CommonModule,
        HabboBadgeModule
    ],
    declarations: [
        SlimArticleComponent
    ],
    exports: [
        SlimArticleComponent
    ]
})
export class SlimArticleModule {
}
