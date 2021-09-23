import { DialogComponent } from './dialog.component';
import { DialogService } from '../../../core/common-services/dialog.service';
import { DialogButton } from './dialog.model';

describe('DialogComponent', () => {

    let component: DialogComponent<any>;
    let dialogService;

    beforeEach(() => {
        dialogService = {
            onOpenCallback: null,
            onCloseCallback: null,
            onActionSubject: {next: () => null},
            onOpen: {
                subscribe: callback => dialogService.opOpenCallback = callback
            },
            onClose: {
                subscribe: callback => dialogService.onCloseCallback = callback
            }
        };

        component = new DialogComponent(<DialogService><unknown>dialogService, null);
    });

    describe('onClose', () => {
        it('should not close the dialog if event is null', () => {
            // Given
            component.isVisible = true;

            // When
            component.onClose(null);

            // Then
            expect(component.isVisible).toBeTruthy();
        });
        it('should not close the dialog if click was inside dialog-wrapper', () => {
            // Given
            component.isVisible = true;
            const event = {
                composedPath: () => [{classList: {contains: () => true}}]
            };

            // When
            component.onClose(event);

            // Then
            expect(component.isVisible).toBeTruthy();
        });
        it('should close the dialog if the click was outside dialog-wrapper', () => {
            // Given
            component.isVisible = true;
            const event = {
                composedPath: () => [{classList: {contains: () => false}}]
            };

            // When
            component.onClose(event);

            // Then
            expect(component.isVisible).toBeFalsy();
        });
    });

    it('onAction should send the button to dialog service', () => {
        // Given
        const button = {} as DialogButton;
        spyOn(dialogService.onActionSubject, 'next');

        // When
        component.onAction(button);

        // Then
        expect(dialogService.onActionSubject.next).toHaveBeenCalledWith(button);
    });
});
