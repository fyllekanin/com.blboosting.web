import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { usersRoutes } from './users.routes';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserComponent } from './user/user.component';

@NgModule({
    imports: [
        RouterModule.forChild(usersRoutes),
        CommonModule
    ],
    declarations: [
        UsersComponent,
        UsersListComponent,
        UserComponent
    ],
    exports: [
        RouterModule
    ]
})
export class UsersModule {
}
