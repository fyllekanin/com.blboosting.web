import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { defaultRoutes } from './default.routes';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { DefaultComponent } from './default.component';
import { ContentModule } from '../../shared/components/content/content.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        RouterModule.forChild(defaultRoutes),
        CommonModule,
        ContentModule,
        FormsModule
    ],
    declarations: [
        HomeComponent,
        NotFoundComponent,
        DefaultComponent
    ],
    providers: [],
    exports: [
        RouterModule
    ]
})
export class DefaultModule {
}
