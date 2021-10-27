import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { SelectItem } from './select.interface';

@Component({
    selector: 'app-form-select',
    templateUrl: 'select.component.html',
    styleUrls: ['select.component.scss']
})
export class SelectComponent {
    private _items: Array<SelectItem> = [];

    @Input()
    disabled: boolean;
    @Input()
    placeholder = 'Select...';
    @Input()
    value: SelectItem = null;
    @Output()
    valueChange: EventEmitter<SelectItem> = new EventEmitter();

    isOpen = false;
    filter: string = null;
    filteredItems: Array<SelectItem> = [];

    constructor(private _elementRef: ElementRef) {
    }

    @Input()
    set items(items: Array<SelectItem>) {
        this._items = items;
        this.filteredItems = items;
    }

    get textContent(): string {
        return this._items.length > 0 ? (this.value ? this.value.label : null) : 'No items...';
    }

    @HostListener('document:click', ['$event'])
    click(event) {
        if (!this._elementRef.nativeElement.contains(event.target) && this.isOpen) {
            this.onClose();
        }
    }

    onFocus() {
        if (!this.disabled && this._items.length > 0) {
            this.isOpen = true;
        }
    }

    onValueChanged(item: SelectItem) {
        this.value = item;
        this.isOpen = false;
        this.valueChange.emit(this.value);
    }

    onFilterInput(value: string): void {
        this.filter = value;
        const regex = new RegExp(value, 'ig');
        this.filteredItems = this._items.filter(item => item.label.match(regex));
    }

    @HostListener('blur')
    onClose() {
        this.isOpen = false;
        console.log(`filter: ${this.filter}`);
        if (this.filter === '') {
            this.value = null;
            this.valueChange.emit(null);
        }
    }
}
