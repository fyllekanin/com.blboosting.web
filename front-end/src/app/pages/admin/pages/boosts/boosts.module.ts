import { boostsRoutes } from './boosts.routes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentModule } from '../../../../shared/components/content/content.module';
import { BoostComponent } from './boost/boost.component';
import { BoostsComponent } from './boosts.component';
import { BoostsListComponent } from './boosts-list/boosts-list.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BoostResolver } from './boost/boost.resolver';
import { SelectModule } from '../../../../shared/components/form/select/select.module';

@NgModule({
    imports: [
        RouterModule.forChild(boostsRoutes),
        CommonModule,
        ContentModule,
        FormsModule,
        SelectModule
    ],
    declarations: [
        BoostComponent,
        BoostsComponent,
        BoostsListComponent
    ],
    providers: [
        BoostResolver
    ],
    exports: [RouterModule],
})
export class BoostsModule {
}
