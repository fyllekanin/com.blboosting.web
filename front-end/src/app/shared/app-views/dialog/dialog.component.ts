import {
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    HostBinding,
    HostListener,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { DialogService } from '../../../core/common-services/dialog.service';
import { DialogButton } from './dialog.model';

@Component({
    selector: 'app-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: [ 'dialog.component.css' ]
})
export class DialogComponent<C> {
    private componentInstance: ComponentRef<C>;
    @ViewChild('container', { read: ViewContainerRef, static: true }) containerElement;
    @HostBinding('class.visible') isVisible = false;

    content: string = null;
    title: string = null;
    buttons: Array<DialogButton> = [];

    constructor (
        private dialogService: DialogService,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
        dialogService.onOpen.subscribe(configuration => {
            this.onReset();

            this.isVisible = true;
            this.title = configuration.title;
            this.buttons = configuration.buttons;
            if (this.buttons.filter(button => button.isClosing).length !== 1) {
                throw new Error('A dialog need and can only have one closing button');
            }
            if (configuration.component) {
                this.componentInstance = this.containerElement
                    .createComponent(this.componentFactoryResolver.resolveComponentFactory((configuration.component)));
                this.dialogService.setComponentInstance(this.componentInstance);
            } else {
                this.content = configuration.content;
            }
        });
        dialogService.onClose.subscribe(() => this.isVisible = false);
    }

    @HostListener('click', [ '$event' ])
    onClose (event): void {
        const path = event ? event.composedPath ? event.composedPath() : (event.path || []) : [];
        if (path.length === 0) {
            return;
        }
        const isInsideWrapper = path
            .some(item => item.classList && item.classList.contains('dialog-wrapper'));
        if (!isInsideWrapper) {
            this.isVisible = false;

            const closeButton = this.buttons.find(button => button.isClosing);
            this.dialogService.onActionSubject.next(closeButton);
        }
    }

    onAction (button: DialogButton): void {
        this.dialogService.onActionSubject.next(button);
    }

    private onReset (): void {
        this.containerElement.clear();
        this.title = null;
        this.content = null;
    }
}
