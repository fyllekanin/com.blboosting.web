import { Routes } from '@angular/router';
import { RolesComponent } from './roles.component';
import { RolesListComponent } from './roles-list/roles-list.component';
import { RoleComponent } from './role/role.component';
import { RolesListResolver } from './roles-list/roles-list.resolver';
import { RoleService } from './role/role.service';

export const rolesRoutes: Routes = [
    {
        path: '',
        component: RolesComponent,
        children: [
            {
                path: 'page/:page',
                component: RolesListComponent,
                resolve: {
                    data: RolesListResolver
                }
            },
            {
                path: 'role/:id',
                component: RoleComponent,
                resolve: {
                    data: RoleService
                }
            }
        ]
    }
];
