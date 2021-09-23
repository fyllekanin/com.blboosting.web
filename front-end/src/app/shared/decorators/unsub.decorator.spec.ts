import { OnDestroy } from '@angular/core';
import { CombineSubscriptions, UnSub } from './unsub.decorator';
import { Unsubscribable } from 'rxjs';

@UnSub()
class Example implements OnDestroy {
    @CombineSubscriptions()
    subscriber: Unsubscribable;

    ngOnDestroy(): void {
        // Empty
    }
}

describe('Unsub Decorator', () => {

    it('should run unsubscribe on all subscriptions', () => {
        // Given
        const example = new Example();
        const firstSubscription = <Unsubscribable><unknown>{ unsubscribe: () => null };
        const secondSubscription = <Unsubscribable><unknown>{ unsubscribe: () => null };
        spyOn(firstSubscription, 'unsubscribe');
        spyOn(secondSubscription, 'unsubscribe');
        example.subscriber = firstSubscription;
        example.subscriber = secondSubscription;

        // when
        example.ngOnDestroy();

        // Then
        expect(firstSubscription.unsubscribe).toHaveBeenCalled();
        expect(secondSubscription.unsubscribe).toHaveBeenCalled();
    });

});
