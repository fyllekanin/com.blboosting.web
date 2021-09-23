import { AuthService } from './../../../../core/auth/auth.service';
import { take } from 'rxjs/operators';
import { Component } from '@angular/core';
import { DialogService } from '../../../../core/common-services/dialog.service';
import { RadioService } from '../../../../core/common-services/radio.service';
import { ButtonTypes } from '../../dialog/dialog.model';
import { ContinuesInformationService } from '../../../../core/common-services/continues-information.service';
import { RadioContentComponent } from './radio-content/radio-content.component';

@Component({
    selector: 'app-header-radio',
    templateUrl: 'header-radio.component.html',
    styleUrls: ['header-radio.component.css']
})
export class HeaderRadioComponent {
    private static readonly UNKNOWN = 'Unknown';
    stats = {
        listeners: 0,
        likes: 0,
        song: HeaderRadioComponent.UNKNOWN,
        username: HeaderRadioComponent.UNKNOWN,
        habbo: HeaderRadioComponent.UNKNOWN,
        nextDj: HeaderRadioComponent.UNKNOWN
    };

    constructor(
        private authService: AuthService,
        private dialogService: DialogService,
        private continuesInformationService: ContinuesInformationService,
        public radioService: RadioService
    ) {
        this.continuesInformationService.onContinuesInformation.subscribe(data => {
            this.stats.listeners = data.radioStats ? data.radioStats.listeners : 0;
            this.stats.song = data.radioStats ? data.radioStats.song : HeaderRadioComponent.UNKNOWN;
            this.stats.likes = data.radioStats && data.radioStats.currentDj ? data.radioStats.currentDj.likes : 0;
            this.stats.username = data.radioStats && data.radioStats.currentDj ?
                data.radioStats.currentDj.username : HeaderRadioComponent.UNKNOWN;
            this.stats.habbo = data.radioStats && data.radioStats.currentDj ?
                data.radioStats.currentDj.habbo : HeaderRadioComponent.UNKNOWN;

            this.stats.nextDj = data.radioStats && data.radioStats.nextDj ?
                data.radioStats.nextDj.username : HeaderRadioComponent.UNKNOWN;
        });
    }

    openRequest(): void {
        this.dialogService.onComponentInstance.pipe(take(1)).subscribe(async ref => {
            this.dialogService.onAction.pipe(take(1)).subscribe(async button => {
                if (button.action === 'request') {
                    await this.radioService.doRequest(ref.instance.content);
                }
                this.dialogService.close();
            });
        });
        const buttons = [
            {
                label: 'Cancel',
                action: 'cancel',
                isClosing: true,
                type: ButtonTypes.GRAY
            },
            {
                label: 'Request',
                action: 'request',
                type: ButtonTypes.BLUE
            }
        ];
        const skippedActions = this.authService.isLoggedIn() ? [] : ['request'];

        this.dialogService.open({
            title: 'Request a song, shoutout or just say hello!',
            component: RadioContentComponent,
            buttons: buttons.filter(button => !skippedActions.includes(button.action))
        });
    }
}
