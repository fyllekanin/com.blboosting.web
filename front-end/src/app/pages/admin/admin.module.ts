import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { SideMenuModule } from '../../shared/components/side-menu/side-menu.module';
import { CommonModule } from '@angular/common';
import { ContentModule } from '../../shared/components/content/content.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { adminRoutes } from './admin.routes';
import { DashboardResolver } from './pages/dashboard/dashboard.resolver';

@NgModule({
    imports: [
        RouterModule.forChild(adminRoutes),
        CommonModule,
        SideMenuModule,
        ContentModule
    ],
    declarations: [
        AdminComponent,
        DashboardComponent
    ],
    providers: [
        DashboardResolver
    ],
    exports: [
        RouterModule
    ]
})
export class AdminModule {
}
