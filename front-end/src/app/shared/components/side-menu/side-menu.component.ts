import { Component, Input } from '@angular/core';
import { ISideMenu } from './side-menu.interface';

@Component({
    selector: 'app-side-menu',
    templateUrl: 'side-menu.component.html',
    styleUrls: [ 'side-menu.component.css' ]
})
export class SideMenuComponent {
    menu: ISideMenu;
    isAnyChildrenApplicable = false;

    @Input()
    set model (menu: ISideMenu) {
        this.menu = menu;
        this.menu.items = this.menu.items.filter(item => item.isApplicable);
        this.isAnyChildrenApplicable = this.menu.items.some(item => item.isApplicable);
    }
}
