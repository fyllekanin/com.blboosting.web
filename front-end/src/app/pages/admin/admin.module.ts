import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { CommonModule } from '@angular/common';
import { ContentModule } from '../../shared/components/content/content.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { adminRoutes } from './admin.routes';
import { DashboardResolver } from './pages/dashboard/dashboard.resolver';
import { BoostsModule } from './pages/boosts/boosts.module';

@NgModule({
    imports: [
        RouterModule.forChild(adminRoutes),
        CommonModule,
        ContentModule,
        BoostsModule
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
