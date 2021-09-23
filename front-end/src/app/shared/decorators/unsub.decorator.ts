import 'reflect-metadata';
import { Unsubscribable } from 'rxjs';

const triggerMethod = 'ngOnDestroy';

export function UnSub() {

    return function (target) {
        const unsubscribableLike: { subscriptions: Array<Unsubscribable>, unsubscribe: () => void } = {
            subscriptions: [],
            unsubscribe,
        };
        // @ts-ignore
        const subscriber: string = Reflect.getMetadata('subscription:name', target.prototype, 'subscriber');

        Object.defineProperty(target.prototype, subscriber ? subscriber : 'subscriber', {
            get: () => unsubscribableLike,
            set: subscription => unsubscribableLike.subscriptions.push(subscription),
        });

        if (typeof target.prototype[triggerMethod] !== 'function') {
            throw new Error(`${target.prototype.constructor.name} must implement ${triggerMethod}() lifecycle hook`);
        }

        target.prototype[triggerMethod] = ngOnDestroyDecorator(target.prototype[triggerMethod]);

        function ngOnDestroyDecorator(f) {
            return function () {
                unsubscribe();
                return f.apply(this, arguments);
            };
        }

        function unsubscribe() {
            do {
                const sub: Unsubscribable = unsubscribableLike.subscriptions.shift();
                if (sub && typeof sub.unsubscribe === 'function') {
                    sub.unsubscribe();
                }
            } while (unsubscribableLike.subscriptions.length);
        }

        return target;
    };

}

export function CombineSubscriptions(params?) {
    return function (target, propertyKey: string | symbol) {
        Reflect.defineMetadata('subscription:name', propertyKey, target, 'subscriber');
    };
}
