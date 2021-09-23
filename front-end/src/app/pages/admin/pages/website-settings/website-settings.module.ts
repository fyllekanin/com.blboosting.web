import { BbcodeComponent } from './bbcodes/bbcode/bbcode.component';
import { BbcodeService } from './bbcodes/bbcode/bbcode.service';
import { NgModule } from '@angular/core';
import { TableModule } from '../../../../shared/components/table/table.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContentModule } from '../../../../shared/components/content/content.module';
import { CommonModule } from '@angular/common';
import { WebsiteSettingsComponent } from './website-settings.component';
import { WebsiteSettingsListComponent } from './list/website-settings-list.component';
import { websiteSettingsRoutes } from './website-settings.routes';
import { StaffListService } from './staff-list/staff-list.service';
import { StaffListComponent } from './staff-list/staff-list.component';
import { RadioSettingsComponent } from './radio-settings/radio-settings.component';
import { RadioSettingsService } from './radio-settings/radio-settings.service';
import { BbcodeListComponent } from './bbcodes/list/bbcode-list.component';
import { HomePageSettingsService } from './home-page-settings/home-page-settings.service';
import { HomePageSettingsComponent } from './home-page-settings/home-page-settings.component';
import { SlideShowModule } from '../../../../shared/components/slide-show/slide-show.module';

@NgModule({
    imports: [
        RouterModule.forChild(websiteSettingsRoutes),
        ContentModule,
        CommonModule,
        TableModule,
        FormsModule,
        SlideShowModule
    ],
    declarations: [
        WebsiteSettingsComponent,
        WebsiteSettingsListComponent,
        StaffListComponent,
        RadioSettingsComponent,
        BbcodeListComponent,
        BbcodeComponent,
        HomePageSettingsComponent
    ],
    providers: [
        StaffListService,
        RadioSettingsService,
        BbcodeService,
        HomePageSettingsService
    ],
    exports: [
        RouterModule
    ]
})
export class WebsiteSettingsModule {
}

