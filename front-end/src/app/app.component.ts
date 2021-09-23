import { AfterContentInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RadioService } from './core/common-services/radio.service';
import { ContinuesInformationService } from './core/common-services/continues-information.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentInit {
    @ViewChild('radio', { static: true }) radioElement: ElementRef<HTMLAudioElement>;

    constructor (
        private radioService: RadioService,
        private continuesInformationService: ContinuesInformationService
    ) {
        this.addActivityListeners();
    }

    ngAfterContentInit (): void {
        this.radioService.setRadioElement(this.radioElement.nativeElement);
    }

    private addActivityListeners (): void {
        window.addEventListener('focus', () => {
            this.continuesInformationService.setUserState(true);
        });
        window.addEventListener('blur', () => {
            this.continuesInformationService.setUserState(false);
        });
    }
}
