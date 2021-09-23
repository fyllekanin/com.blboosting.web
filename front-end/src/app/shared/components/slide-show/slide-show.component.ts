import { Component, Input, OnDestroy, OnInit } from '@angular/core';

export interface SlideShowImage {
    id?: string;
    link: any;
    caption: string;
    isActive: boolean;
}

@Component({
    selector: 'app-slide-show',
    templateUrl: 'slide-show.component.html',
    styleUrls: ['slide-show.component.css']
})
export class SlideShowComponent implements OnInit, OnDestroy {
    private intervalTimer: any;

    currentImage = 0;

    @Input() images: Array<SlideShowImage> = [
        { link: 'https://dummyimage.com/1000x250/000/fff', caption: 'Test #1', isActive: true },
        { link: 'https://dummyimage.com/1000x250/000/323', caption: 'Test #2', isActive: false },
        { link: 'https://dummyimage.com/1000x250/000/000', caption: 'Test #3', isActive: false }
    ];

    ngOnInit (): void {
        this.intervalTimer = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    ngOnDestroy (): void {
        clearInterval(this.intervalTimer);
    }

    previousSlide (): void {
        if (this.currentImage === 0) {
            this.currentImage = this.images.length - 1;
        } else {
            this.currentImage--;
        }
        this.updateActiveSlide();
    }

    nextSlide (): void {
        if (this.currentImage === (this.images.length - 1)) {
            this.currentImage = 0;
        } else {
            this.currentImage++;
        }
        this.updateActiveSlide();
    }

    goTo (imageIndex: number): void {
        this.currentImage = imageIndex;
        this.updateActiveSlide();
    }

    private updateActiveSlide (): void {
        this.images.forEach((image, index) => {
            image.isActive = index === this.currentImage;
        });
    }
}
