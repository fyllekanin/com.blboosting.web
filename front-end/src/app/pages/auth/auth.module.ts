import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentModule } from '../../shared/components/content/content.module';
import { RouterModule } from '@angular/router';
import { authRoutes } from './auth.routes';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    imports: [
        RouterModule.forChild(authRoutes),
        CommonModule,
        ContentModule
    ],
    declarations: [
        AuthComponent,
        LoginComponent
    ],
    providers: [],
    exports: [
        RouterModule
    ]
})
export class AuthModule {
}
