import { NgModule } from '@angular/core';
import { SideMenuModule } from '../../shared/components/side-menu/side-menu.module';
import { CommonModule } from '@angular/common';
import { ContentModule } from '../../shared/components/content/content.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { userRoutes } from './user.routes';
import { ChangePasswordService } from './pages/change-password/change-password.service';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { FormsModule } from '@angular/forms';
import { ChangeHabboComponent } from './pages/change-habbo/change-habbo.component';
import { ChangeHabboService } from './pages/change-habbo/change-habbo.service';

@NgModule({
    imports: [
        RouterModule.forChild(userRoutes),
        CommonModule,
        SideMenuModule,
        ContentModule,
        FormsModule
    ],
    declarations: [
        UserComponent,
        DashboardComponent,
        ChangePasswordComponent,
        ChangeHabboComponent
    ],
    providers: [
        ChangePasswordService,
        ChangeHabboService
    ],
    exports: [
        RouterModule
    ]
})
export class UserModule {
}
