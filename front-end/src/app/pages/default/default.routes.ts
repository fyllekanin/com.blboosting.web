import { ArticleService } from './article/article.service';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DefaultComponent } from './default.component';
import { StaffListResolver } from './staff-list/staff-list.resolver';
import { StaffListComponent } from './staff-list/staff-list.component';
import { HomeResolver } from './home/home.resolver';
import { ArticleComponent } from './article/article.component';
import { TimeTableTypes } from '../../shared/components/timetable/timetable.interface';
import { TimetableComponent } from '../../shared/components/timetable/timetable.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { ArticlesComponent } from './articles/articles.component';
import { ArticlesService } from './articles/articles.service';
import { JobApplicationService } from './job-application/job-application.service';
import { JobApplicationComponent } from './job-application/job-application.component';

export const defaultRoutes: Routes = [
    {
        path: '',
        component: DefaultComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
                resolve: {
                    data: HomeResolver
                }
            },
            {
                path: 'not-found',
                component: NotFoundComponent
            },
            {
                path: 'not-authorized',
                component: NotAuthorizedComponent
            },
            {
                path: 'staff-list',
                component: StaffListComponent,
                resolve: {
                    data: StaffListResolver
                }
            },
            {
                path: 'article/:articleId/page/:page',
                component: ArticleComponent,
                resolve: {
                    data: ArticleService
                },
                runGuardsAndResolvers: 'pathParamsChange'
            },
            {
                path: 'timetable/radio/:day',
                component: TimetableComponent,
                data: {
                    type: TimeTableTypes.RADIO,
                    isPublic: true
                }
            },
            {
                path: 'timetable/events/:day',
                component: TimetableComponent,
                data: {
                    type: TimeTableTypes.EVENTS,
                    isPublic: true
                }
            },
            {
                path: 'articles/page/:page',
                component: ArticlesComponent,
                resolve: {
                    data: ArticlesService
                },
                runGuardsAndResolvers: 'paramsOrQueryParamsChange'
            },
            {
                path: 'job-application',
                component: JobApplicationComponent,
                resolve: {
                    data: JobApplicationService
                }
            }
        ]
    }
];
