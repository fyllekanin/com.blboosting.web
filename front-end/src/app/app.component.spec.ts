import { AppComponent } from './app.component';
import { RadioService } from './core/common-services/radio.service';
import { ElementRef } from '@angular/core';

describe('AppComponent', () => {

    let component: AppComponent;
    let radioService: RadioService;

    beforeEach(() => {
        radioService = <RadioService><unknown>{
            setRadioElement: () => null
        };
        component = new AppComponent(radioService, null);
    });

    it('ngAfterContentInit should set the radio element', () => {
        // Given
        spyOn(radioService, 'setRadioElement');
        component.radioElement = <ElementRef<any>><unknown>{
            nativeElement: {}
        };

        // When
        component.ngAfterContentInit();

        // Then
        expect(radioService.setRadioElement).toHaveBeenCalledWith(component.radioElement.nativeElement);
    });
});
