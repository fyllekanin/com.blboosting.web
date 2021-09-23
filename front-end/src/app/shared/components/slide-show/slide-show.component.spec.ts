import { SlideShowComponent } from './slide-show.component';

describe('SlideShowComponent', () => {

    let component: SlideShowComponent;

    beforeEach(() => {
        component = new SlideShowComponent();
    });

    describe('previousSlide', () => {
        it('should go to the previous slide if present', () => {
            // Given
            component.currentImage = 1;

            // When
            component.previousSlide();

            // Then
            expect(component.currentImage).toEqual(0);
            expect(component.images[0].isActive).toBeTrue();
        });
        it('should go to the last slide if no more previous', () => {
            // Given
            component.currentImage = 0;

            // When
            component.previousSlide();

            // Then
            expect(component.currentImage).toEqual(2);
            expect(component.images[2].isActive).toBeTrue();
        });
    });

    describe('nextSlide', () => {
        it('should go to the next slide if present', () => {
            // Given
            component.currentImage = 1;

            // When
            component.nextSlide();

            // Then
            expect(component.currentImage).toEqual(2);
            expect(component.images[2].isActive).toBeTrue();
        });
        it('should go to the first slide if no more slides', () => {
            // Given
            component.currentImage = 2;

            // When
            component.nextSlide();

            // Then
            expect(component.currentImage).toEqual(0);
            expect(component.images[0].isActive).toBeTrue();
        });
    });

    it('goTo should go to the provided slide', () => {
        // When
        component.goTo(1);

        // Then
        expect(component.currentImage).toBe(1);
        expect(component.images[1].isActive).toBeTrue();
    });
});
