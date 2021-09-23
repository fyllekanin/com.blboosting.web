import { NgModule } from '@angular/core';
import { TableModule } from '../../../../shared/components/table/table.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContentModule } from '../../../../shared/components/content/content.module';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { GroupListService } from './groups/list/group-list.service';
import { GroupComponent } from './groups/group/group.component';
import { GroupListComponent } from './groups/list/group-list.component';
import { GroupService } from './groups/group/group.service';
import { usersRoutes } from './users.routes';
import { PaginationModule } from '../../../../shared/components/pagination/pagination.module';
import { UserListComponent } from './users/list/user-list.component';
import { UserListService } from './users/list/user-list.service';
import { UserGroupsComponent } from './users/user-groups/user-groups.component';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { UserDetailsService } from './users/user-details/user-details.service';
import { UserGroupsService } from './users/user-groups/user-groups.service';

@NgModule({
    imports: [
        RouterModule.forChild(usersRoutes),
        ContentModule,
        CommonModule,
        TableModule,
        FormsModule,
        PaginationModule
    ],
    declarations: [
        UsersComponent,
        GroupComponent,
        GroupListComponent,
        UserListComponent,
        UserGroupsComponent,
        UserDetailsComponent
    ],
    providers: [
        GroupService,
        GroupListService,
        UserListService,
        UserDetailsService,
        UserGroupsService
    ],
    exports: [
        RouterModule
    ]
})
export class UsersModule {
}

