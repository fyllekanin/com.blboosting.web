import { Component, ElementRef, NgZone, ViewChild, ViewEncapsulation } from '@angular/core';
import { SiteNotificationService } from '../../../core/common-services/site-notification.service';
import { SiteNotification, SiteNotificationType } from './site-notification.interface';

@Component({
    selector: 'app-site-notification',
    templateUrl: 'site-notification.component.html',
    styleUrls: [ 'site-notification.component.css' ],
    encapsulation: ViewEncapsulation.None
})
export class SiteNotificationComponent {
    private static readonly FIVE_SECONDS = 5000;
    private static readonly CLASS = 'site-notification';
    private static readonly TYPES = {
        [SiteNotificationType.INFO]: 'info',
        [SiteNotificationType.ERROR]: 'error',
        [SiteNotificationType.SUCCESS]: 'success',
        [SiteNotificationType.WARNING]: 'warning'
    };
    @ViewChild('wrapper', { static: true }) wrapper: ElementRef;

    constructor (private ngZone: NgZone, service: SiteNotificationService) {
        service.onSiteNotification.subscribe(this.onNotification.bind(this));
    }

    private onNotification (notification: SiteNotification): void {
        const node = this.createElement(notification);
        this.wrapper.nativeElement.appendChild(node);
    }

    private createElement (notification: SiteNotification): Node {
        const node = document.createElement('div');
        node.className = `${SiteNotificationComponent.CLASS} ${SiteNotificationComponent.CLASS}-hidden ` +
            `${SiteNotificationComponent.CLASS}-${SiteNotificationComponent.TYPES[notification.type]}`;

        this.ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                node.className = node.className.replace(`${SiteNotificationComponent.CLASS}-hidden`, '');
            }, 200);
            setTimeout(this.dismissNotification.bind(this, node), SiteNotificationComponent.FIVE_SECONDS);
        });

        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = notification.title;

        const message = document.createElement('span');
        message.className = 'message';
        message.innerHTML = notification.message;

        const dismiss = document.createElement('i');
        dismiss.className = 'dismiss fa fa-times-circle';
        dismiss.addEventListener('click', this.dismissNotification.bind(this, node));

        node.appendChild(title);
        node.appendChild(message);
        node.appendChild(dismiss);

        return node;
    }

    private dismissNotification (node: HTMLElement): void {
        node.className = node.className + ` ${SiteNotificationComponent.CLASS}-hidden`;
        setTimeout(() => {
            node.style.display = 'none';
            node.remove();
        }, 2100);
    }
}
