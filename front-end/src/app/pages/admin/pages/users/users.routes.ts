import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserComponent } from './user/user.component';

export const usersRoutes: Routes = [
    {
        path: '',
        component: UsersComponent,
        children: [
            {
                path: 'page/:page',
                component: UsersListComponent
            },
            {
                path: 'user/:id',
                component: UserComponent
            }
        ]
    }
];
