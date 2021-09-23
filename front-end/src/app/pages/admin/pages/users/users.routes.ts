import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { GroupListComponent } from './groups/list/group-list.component';
import { GroupListService } from './groups/list/group-list.service';
import { GroupComponent } from './groups/group/group.component';
import { GroupService } from './groups/group/group.service';
import { UserListComponent } from './users/list/user-list.component';
import { UserListService } from './users/list/user-list.service';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { UserGroupsComponent } from './users/user-groups/user-groups.component';
import { UserDetailsService } from './users/user-details/user-details.service';
import { UserGroupsService } from './users/user-groups/user-groups.service';

export const usersRoutes: Routes = [
    {
        path: '',
        component: UsersComponent,
        children: [
            {
                path: 'groups/page/:page',
                component: GroupListComponent,
                resolve: {
                    pagination: GroupListService
                },
                runGuardsAndResolvers: 'paramsOrQueryParamsChange'
            },
            {
                path: 'groups/:groupId',
                component: GroupComponent,
                resolve: {
                    data: GroupService
                }
            },
            {
                path: 'users/page/:page',
                component: UserListComponent,
                resolve: {
                    pagination: UserListService
                },
                runGuardsAndResolvers: 'paramsOrQueryParamsChange'
            },
            {
                path: 'users/:userId/details',
                component: UserDetailsComponent,
                resolve: {
                    data: UserDetailsService
                }
            },
            {
                path: 'users/:userId/groups',
                component: UserGroupsComponent,
                resolve: {
                    data: UserGroupsService
                }
            }
        ]
    }
];
