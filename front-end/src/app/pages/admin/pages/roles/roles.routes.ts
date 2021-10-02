import { Routes } from '@angular/router';
import { RolesComponent } from './roles.component';
import { RolesListComponent } from './roles-list/roles-list.component';
import { RoleComponent } from './role/role.component';

export const rolesRoutes: Routes = [
    {
        path: '',
        component: RolesComponent,
        children: [
            {
                path: 'page/:page',
                component: RolesListComponent
            },
            {
                path: 'role/:id',
                component: RoleComponent
            }
        ]
    }
];
