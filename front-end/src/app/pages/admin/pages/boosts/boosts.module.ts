import { boostsRoutes } from './boosts.routes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentModule } from '../../../../shared/components/content/content.module';
import { BoostComponent } from './boost/boost.component';
import { BoostsComponent } from './boosts.component';
import { BoostsListComponent } from './boosts-list/boosts-list.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [CommonModule, ContentModule, RouterModule.forChild(boostsRoutes)],
    declarations: [BoostComponent, BoostsComponent, BoostsListComponent],
    exports: [RouterModule],
})
export class BoostsModule {}
