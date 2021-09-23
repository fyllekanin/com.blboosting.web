import { NgModule } from '@angular/core';
import { ContentModule } from '../content/content.module';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from './side-menu.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        ContentModule,
        RouterModule,
        CommonModule
    ],
    declarations: [
        SideMenuComponent
    ],
    exports: [
        SideMenuComponent
    ]
})
export class SideMenuModule {
}
