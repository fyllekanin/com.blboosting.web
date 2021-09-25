import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    {
        path: 'default',
        loadChildren: () => import('./pages/default/default.module').then(m => m.DefaultModule)
    },
    {
        path: 'admin',
        loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule)
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'default'
    }
];
