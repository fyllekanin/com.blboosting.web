import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { DialogService } from './dialog.service';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs';

@Injectable()
export class GlobalErrorService implements ErrorHandler {

    constructor(
        private dialogService: DialogService,
        private ngZone: NgZone
    ) {
    }


    handleError(error: any): void {
        if (error instanceof HttpErrorResponse) {
            return;
        }

        this.ngZone.run(() => {
            this.dialogService.onAction.pipe(first()).subscribe(() => this.dialogService.close());
            this.dialogService.open({
                title: 'Error - Something unexpected happened',
                content: `<em>Show this error to a developer</em>
                <hr />
                ${error?.message || 'Unexpected error'} <br />
                `,
                buttons: [{ label: 'Close', type: 'button-gray', isClosing: true }]
            });
        });
    }
}
