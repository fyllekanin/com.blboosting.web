import { Component, ElementRef, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomePageSettingsModel } from './home-page-settings.model';
import { UserAction } from '../../../../../shared/constants/common.interfaces';
import { HomePageSettingsService } from './home-page-settings.service';
import { HomePageBannerEntry } from '../../../../../shared/classes/home-page.class';
import { SlideShowImage } from '../../../../../shared/components/slide-show/slide-show.component';
import { IdHelper } from '../../../../../../../../back-end/src/helpers/id.helper';

@Component({
    selector: 'app-admin-website-settings-home-page',
    templateUrl: 'home-page-settings.component.html',
    styleUrls: ['home-page-settings.component.css']
})
export class HomePageSettingsComponent {
    private readonly ACTIONS = {
        SAVE: 'SAVE',
        GO_BACK: 'GO_BACK'
    };
    @ViewChildren('image') imageElements: Array<ElementRef> = [];
    data = {} as HomePageSettingsModel;

    images: Array<SlideShowImage> = [];
    addNewEntryAction: Array<UserAction> = [
        {label: 'Add entry', value: null}
    ];
    contentActions: Array<UserAction> = [
        {label: 'Save', value: this.ACTIONS.SAVE},
        {label: 'Go back', value: this.ACTIONS.GO_BACK}
    ];

    constructor(
        private service: HomePageSettingsService,
        private router: Router,
        activatedRoute: ActivatedRoute
    ) {
        this.data = activatedRoute.snapshot.data.data;
        this.images = this.data.bannerEntries.map(entry => ({
            id: entry.id,
            link: `/resources/banner-entries/${entry.id}.gif`,
            caption: entry.caption,
            isActive: false
        }));
    }

    addNewEntry(): void {
        this.data.bannerEntries.push({id: IdHelper.newUuid(), isNew: true} as HomePageBannerEntry);
    }

    onCaptionChange(): void {
        this.images.forEach(image => {
            const entry = this.data.bannerEntries.find(item => item.id === image.id);
            if (entry) {
                image.caption = entry.caption;
            }
        });
    }

    deleteEntry(entry: HomePageBannerEntry): void {
        entry.isDeleted = true;
    }

    async onFileChange(event: any, entry: HomePageBannerEntry): Promise<void> {
        const result = await this.getFile(event);
        entry.isUpdated = true;
        if (!result) {
            return;
        }
        const image = this.images.find(item => item.id === entry.id);
        if (!image) {
            this.images.push({
                id: entry.id,
                link: result,
                caption: entry.caption,
                isActive: false
            });
        } else {
            image.link = result;
        }
    }

    async onAction(action: UserAction): Promise<void> {
        switch (action.value) {
            case this.ACTIONS.GO_BACK:
                await this.router.navigateByUrl('/admin/website-settings/list');
                break;
            case  this.ACTIONS.SAVE:
                const formData = new FormData();
                formData.append('settings', JSON.stringify(this.data));
                this.imageElements.forEach((element, index) => {
                    formData.append(this.data.bannerEntries[index].id, element.nativeElement.files[0]);
                });
                const result = await this.service.save(formData);
                if (result) {
                    this.data = result;
                    this.images = this.data.bannerEntries.map(entry => ({
                        id: entry.id,
                        link: `/resources/banner-entries/${entry.id}.gif`,
                        caption: entry.caption,
                        isActive: false
                    }));
                }
                break;
        }
    }

    private getFile(event: any): Promise<any> {
        return new Promise(res => {
            if (!event.target.files[0]) {
                res(null);
                return;
            }
            const reader = new FileReader();
            reader.onload = e => {
                res(e.target.result);
            };
            reader.readAsDataURL(event.target.files[0]);
        });
    }
}
