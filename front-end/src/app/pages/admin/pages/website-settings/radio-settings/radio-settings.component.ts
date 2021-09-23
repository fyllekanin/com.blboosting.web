import { Component, OnDestroy } from '@angular/core';
import { RadioSettingsClass, ServerType } from '../../../../../shared/classes/radio-settings.class';
import { Unsubscribable } from 'rxjs';
import { RadioSettingsService } from './radio-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAction } from '../../../../../shared/constants/common.interfaces';
import { CombineSubscriptions } from 'src/app/shared/decorators/unsub.decorator';

@Component({
    selector: 'app-admin-website-settings-radio-settings',
    templateUrl: 'radio-settings.component.html',
    styleUrls: ['radio-settings.component.css']
})
export class RadioSettingsComponent implements OnDestroy {
    private readonly ACTIONS = {
        SAVE: 'save',
        GO_BACK: 'go_back'
    };
    data = {} as RadioSettingsClass;

    serverType = ServerType;
    @CombineSubscriptions()
    subscriber: Unsubscribable;
    contentActions: Array<UserAction> = [
        {label: 'Save', value: this.ACTIONS.SAVE},
        {label: 'Go back', value: this.ACTIONS.GO_BACK}
    ];

    constructor(
        private service: RadioSettingsService,
        private router: Router,
        activatedRoute: ActivatedRoute
    ) {
        this.subscriber = activatedRoute.data.subscribe(data => this.data = data.data);
    }

    async onAction(action: UserAction): Promise<void> {
        switch (action.value) {
            case this.ACTIONS.SAVE:
                await this.service.save(this.data);
                break;
            case this.ACTIONS.GO_BACK:
                this.router.navigateByUrl('/admin/website-settings/list');
                break;
        }
    }

    ngOnDestroy(): void {
        // Empty
    }
}
