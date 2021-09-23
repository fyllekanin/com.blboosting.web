import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { ContinuesInformationModel } from '../../shared/classes/continues-information.model';
import { HttpService } from '../http/http.service';

@Injectable()
export class ContinuesInformationService {
    private setIntervalTimer;
    private onContinuesInformationSubject: Subject<ContinuesInformationModel> = new Subject();
    onContinuesInformation = this.onContinuesInformationSubject.asObservable();

    constructor(
        private ngZone: NgZone,
        private httpService: HttpService
    ) {
        this.doFetch();
        this.updateTimer(true);
    }

    setUserState(isActive: boolean): void {
        this.updateTimer(isActive);
    }

    private getExecutionTime(isActive: boolean): number {
        return isActive ? 10000 : 300000;
    }

    private updateTimer(isActive: boolean): void {
        clearInterval(this.setIntervalTimer);
        if (isActive) {
            this.doFetch();
        }
        this.ngZone.runOutsideAngular(() => {
            this.setIntervalTimer = setInterval(this.doFetch.bind(this), this.getExecutionTime(isActive));
        });
    }

    private doFetch(): void {
        this.httpService.get<ContinuesInformationModel>('/information/continues')
            .subscribe(data => this.ngZone.run(() => this.onContinuesInformationSubject.next(data)));
    }
}
