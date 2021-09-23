import { Routes } from '@angular/router';
import { WebsiteSettingsComponent } from './website-settings.component';
import { WebsiteSettingsListComponent } from './list/website-settings-list.component';
import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffListService } from './staff-list/staff-list.service';
import { RadioSettingsComponent } from './radio-settings/radio-settings.component';
import { RadioSettingsService } from './radio-settings/radio-settings.service';
import { BbcodeListComponent } from './bbcodes/list/bbcode-list.component';
import { GlobalBbcodeService } from 'src/app/core/common-services/global-bbcode.service';
import { BbcodeComponent } from './bbcodes/bbcode/bbcode.component';
import { BbcodeService } from './bbcodes/bbcode/bbcode.service';
import { HomePageSettingsComponent } from './home-page-settings/home-page-settings.component';
import { HomePageSettingsService } from './home-page-settings/home-page-settings.service';

export const websiteSettingsRoutes: Routes = [
    {
        path: '',
        component: WebsiteSettingsComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'list'
            },
            {
                path: 'list',
                component: WebsiteSettingsListComponent
            },
            {
                path: 'staff-list',
                component: StaffListComponent,
                resolve: {
                    data: StaffListService
                }
            },
            {
                path: 'radio-settings',
                component: RadioSettingsComponent,
                resolve: {
                    data: RadioSettingsService
                }
            },
            {
                path: 'bbcodes',
                component: BbcodeListComponent,
                resolve: {
                    data: GlobalBbcodeService
                }
            },
            {
                path: 'bbcodes/:bbcodeId',
                component: BbcodeComponent,
                resolve: {
                    data: BbcodeService
                }
            },
            {
                path: 'home-page-settings',
                component: HomePageSettingsComponent,
                resolve: {
                    data: HomePageSettingsService
                }
            }
        ]
    }
];
