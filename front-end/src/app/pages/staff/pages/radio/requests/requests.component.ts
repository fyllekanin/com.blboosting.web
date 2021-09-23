import { DialogService } from './../../../../../core/common-services/dialog.service';
import { RequestsService } from './requests.service';
import { AuthService } from './../../../../../core/auth/auth.service';
import { CombineSubscriptions, UnSub } from '../../../../../shared/decorators/unsub.decorator';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { RadioRequest } from './requests.model';
import { Unsubscribable } from 'rxjs';
import { UserAction } from 'src/app/shared/constants/common.interfaces';

@Component({
    selector: 'app-staff-radio-requests',
    templateUrl: 'requests.component.html',
    styleUrls: ['requests.component.css']
})
@UnSub()
export class RequestsComponent implements OnDestroy {
    data: Array<RadioRequest> = [];
    @CombineSubscriptions()
    subscriber: Unsubscribable;
    canDeleteRequest = false;

    contentActions: Array<UserAction> = [
        { label: 'Delete', value: 'delete' }
    ];

    constructor(
        private dialogService: DialogService,
        private requestsService: RequestsService,
        authService: AuthService,
        activatedRoute: ActivatedRoute
    ) {
        this.canDeleteRequest = authService.getAuthUser().staffPermissions.CAN_UNBOOK_OTHERS_RADIO;
        this.subscriber = activatedRoute.data.subscribe(this.onData.bind(this));
    }

    ngOnDestroy(): void {
        // Empty
    }

    async onDelete(radioRequestId: number): Promise<void> {
        const answer = await this.dialogService.confirm('Do you really wanna delete this request?');
        if (answer) {
            await this.requestsService.delete(radioRequestId);
            this.data = this.data.filter(item => item.radioRequestId !== radioRequestId);
        }
    }

    private onData({ data }: { data: Array<RadioRequest> }): void {
        this.data = data;
    }
}
