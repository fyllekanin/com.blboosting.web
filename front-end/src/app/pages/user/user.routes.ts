import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserComponent } from './user.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ChangeHabboComponent } from './pages/change-habbo/change-habbo.component';

export const userRoutes: Routes = [
    {
        path: '',
        component: UserComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: DashboardComponent
            },
            {
                path: 'change-password',
                component: ChangePasswordComponent
            },
            {
                path: 'change-habbo',
                component: ChangeHabboComponent
            }
        ]
    }
];
