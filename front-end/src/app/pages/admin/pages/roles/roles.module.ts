import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { rolesRoutes } from './roles.routes';
import { RolesComponent } from './roles.component';
import { RolesListComponent } from './roles-list/roles-list.component';
import { RoleComponent } from './role/role.component';
import { TableModule } from '../../../../shared/components/table/table.module';
import { ContentModule } from '../../../../shared/components/content/content.module';

@NgModule({
    imports: [
        RouterModule.forChild(rolesRoutes),
        CommonModule,
        TableModule,
        ContentModule
    ],
    declarations: [
        RolesComponent,
        RolesListComponent,
        RoleComponent
    ],
    exports: [
        RouterModule
    ]
})
export class RolesModule {
}
