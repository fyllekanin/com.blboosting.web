import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { defaultRoutes } from './default.routes';
import { SlimArticleModule } from '../../shared/components/slim-article/slim-article.module';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { DefaultComponent } from './default.component';
import { ContentModule } from '../../shared/components/content/content.module';
import { HabboBadgeModule } from '../../shared/components/habbo-badge/habbo-badge.module';
import { NgxTwitterTimelineModule } from 'ngx-twitter-timeline';
import { TimetableModule } from '../../shared/components/timetable/timetable.module';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from '../../shared/components/pagination/pagination.module';
import { SlideShowModule } from '../../shared/components/slide-show/slide-show.module';
import { EditorModule } from '../../shared/components/editor/editor.module';

@NgModule({
    imports: [
        RouterModule.forChild(defaultRoutes),
        SlimArticleModule,
        CommonModule,
        ContentModule,
        HabboBadgeModule,
        NgxTwitterTimelineModule,
        TimetableModule,
        FormsModule,
        PaginationModule,
        SlideShowModule,
        EditorModule
    ],
    declarations: [
        HomeComponent,
        NotFoundComponent,
        DefaultComponent
    ],
    providers: [],
    exports: [
        RouterModule
    ]
})
export class DefaultModule {
}
