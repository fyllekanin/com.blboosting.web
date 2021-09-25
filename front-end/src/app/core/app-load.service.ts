import { Injectable, Injector } from '@angular/core';

@Injectable()
export class AppLoadService {

    constructor(private injector: Injector) {
    }

    load(): Promise<any> {
        return new Promise(resolve => {

        });
    }

}
