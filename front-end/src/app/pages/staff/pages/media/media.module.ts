import { NgModule } from '@angular/core';
import { MediaComponent } from './media.component';
import { ArticleComponent } from './articles/article/article.component';
import { ArticleListComponent } from './articles/list/article-list.component';
import { TableModule } from '../../../../shared/components/table/table.module';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '../../../../shared/components/editor/editor.module';
import { HabboBadgeModule } from '../../../../shared/components/habbo-badge/habbo-badge.module';
import { RouterModule } from '@angular/router';
import { ContentModule } from '../../../../shared/components/content/content.module';
import { CommonModule } from '@angular/common';
import { mediaRoutes } from './media.routes';
import { ArticleListService } from './articles/list/article-list.service';
import { ArticleService } from './articles/article/article.service';
import { PaginationModule } from '../../../../shared/components/pagination/pagination.module';

@NgModule({
    imports: [
        RouterModule.forChild(mediaRoutes),
        ContentModule,
        CommonModule,
        TableModule,
        FormsModule,
        EditorModule,
        HabboBadgeModule,
        PaginationModule
    ],
    declarations: [
        MediaComponent,
        ArticleComponent,
        ArticleListComponent
    ],
    providers: [
        ArticleListService,
        ArticleService
    ],
    exports: [
        RouterModule
    ]
})
export class MediaModule {
}

