import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login.component';

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
        path: 'auth',
        component: LoginComponent
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'default'
    }
];
