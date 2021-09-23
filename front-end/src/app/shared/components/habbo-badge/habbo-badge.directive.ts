import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appHabboBadge]'
})
export class HabboBadgeDirective {
    private static readonly DEFAULT = '/assets/images/badge_error.gif';
    private static readonly URL = 'https://images.habbogroup.com/c_images/album1584/{code}.{extension}';
    private static readonly BOX_SHADOW = '0 2px 2px 0 rgba(177, 177, 177, 0.35)';
    private static readonly EXTENSIONS = [
        'png',
        'gif',
        'jpg'
    ];
    private _code: string;
    private _isActive: boolean;
    private _timeout: number;

    @HostBinding('style.width') myWidth = '50px';
    @HostBinding('style.height') myHeight = '50px';
    @HostBinding('style.background-color') myBackgroundColor = '#eaeae6';
    @HostBinding('style.border-radius') myBorderRadius = '5px';
    @HostBinding('style.transition') myTransition = '0.6s';
    @HostBinding('style.padding') myPadding = '7px';
    @HostBinding('style.margin') myMargin = '5px 0';
    @HostBinding('style.opacity') myOpacity = 0.5;
    @HostBinding('style.-webkit-box-shadow') myWebkitBoxShadow = HabboBadgeDirective.BOX_SHADOW;
    @HostBinding('style.-moz-box-shadow') myMozBoxShadow = HabboBadgeDirective.BOX_SHADOW;
    @HostBinding('style.box-shadow') myBoxShadow = HabboBadgeDirective.BOX_SHADOW;

    constructor (private _elementRef: ElementRef) {
    }

    @Input()
    set code (code: string) {
        clearTimeout(this._timeout);
        // @ts-ignore
        this._timeout = setTimeout(() => {
            this._code = code;
            this.setImage(0);
        }, 200);
    }

    @Input()
    set isActive (isActive) {
        this._isActive = isActive;
        this.myOpacity = this._isActive ? 1 : 0.5;
    }

    @HostListener('mouseover')
    onMouseOver (): void {
        this.myBackgroundColor = '#2f2f2f';
        this.myOpacity = 1;
    }

    @HostListener('mouseleave')
    onMouseLeave (): void {
        this.myBackgroundColor = '#eaeae6';
        this.myOpacity = this._isActive ? 1 : 0.5;
    }

    private setImage (index: number): void {
        const image = new Image();
        const path = HabboBadgeDirective.URL
            .replace('{code}', this._code)
            .replace('{extension}', HabboBadgeDirective.EXTENSIONS[index]);

        image.onload = () => {
            this._elementRef.nativeElement.src = path;
        };
        image.onerror = () => {
            if (index < (HabboBadgeDirective.EXTENSIONS.length - 1)) {
                this.setImage(index + 1);
            }
        };
        image.src = path;
    }
}
