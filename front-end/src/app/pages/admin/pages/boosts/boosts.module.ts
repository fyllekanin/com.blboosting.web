import { boostsRoutes } from './boosts.routes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentModule } from '../../../../shared/components/content/content.module';
import { BoostComponent } from './boost/boost.component';
import { BoostsComponent } from './boosts.component';
import { BoostsListComponent } from './boosts-list/boosts-list.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BoostService } from './boost/boost.service';
import { SelectModule } from '../../../../shared/components/form/select/select.module';
import { PaginationModule } from '../../../../shared/components/pagination/pagination.module';
import { TableModule } from '../../../../shared/components/table/table.module';

@NgModule({
    imports: [
        RouterModule.forChild(boostsRoutes),
        CommonModule,
        ContentModule,
        FormsModule,
        SelectModule,
        PaginationModule,
        TableModule
    ],
    declarations: [
        BoostComponent,
        BoostsComponent,
        BoostsListComponent
    ],
    providers: [
        BoostService
    ],
    exports: [RouterModule],
})
export class BoostsModule {
}
