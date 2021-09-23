import { Routes } from '@angular/router';
import { ArticleListComponent } from './articles/list/article-list.component';
import { ArticleListService } from './articles/list/article-list.service';
import { ArticleComponent } from './articles/article/article.component';
import { ArticleService } from './articles/article/article.service';
import { MediaComponent } from './media.component';

export const mediaRoutes: Routes = [
    {
        path: '',
        component: MediaComponent,
        children: [
            {
                path: 'articles/page/:page',
                component: ArticleListComponent,
                resolve: {
                    pagination: ArticleListService
                },
                runGuardsAndResolvers: 'paramsOrQueryParamsChange'
            },
            {
                path: 'articles/:articleId',
                component: ArticleComponent,
                resolve: {
                    data: ArticleService
                }
            }
        ]
    }
];
