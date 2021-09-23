import { Component, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CombineSubscriptions, UnSub } from '../../decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';

@Component({
    selector: 'app-pagination',
    templateUrl: 'pagination.component.html',
    styleUrls: [ 'pagination.component.css' ]
})
@UnSub()
export class PaginationComponent implements OnDestroy {
    private readonly _url: string;
    private _total: number;

    currentPage: number;
    queryParameters: Params;
    @CombineSubscriptions()
    subscriber: Unsubscribable;
    fillBackwardItems: Array<number> = [];
    backwardItems: Array<number> = [];

    fillForwardItems: Array<number> = [];
    forwardItems: Array<number> = [];
    thereIsPrevious: boolean;
    thereIsNext: boolean;

    constructor (
        private router: Router,
        activatedRoute: ActivatedRoute
    ) {
        const currentPath = `/${activatedRoute.snapshot.url.map(segment => segment.path).join('/')}`;
        const prefix = this.router.url.replace(currentPath, '');
        this._url = `${prefix}/${activatedRoute.snapshot.routeConfig.path}`;
        this.subscriber = activatedRoute.queryParams.subscribe(params => this.queryParameters = params);
    }

    @Input()
    set total (total: number) {
        this._total = total;
        this.updateGaps();
    }

    @Input()
    set page (page: number) {
        this.currentPage = page;
        this.updateGaps();
    }

    ngOnDestroy (): void {
        // Empty
    }

    goToPrevious (): void {
        this.router.navigateByUrl(this.getUrl(this.currentPage - 1), { queryParams: this.queryParameters });
    }

    goToNext (): void {
        this.router.navigateByUrl(this.getUrl(this.currentPage + 1), { queryParams: this.queryParameters });
    }

    private getUrl (page: number): string {
        return this._url.replace(':page', String(page));
    }

    private updateGaps (): void {
        this.thereIsPrevious = this.currentPage > 1;
        this.thereIsPrevious = this.currentPage < this._total;
        this.fillBackwardItems = this.getFillBackwardItems();
        this.backwardItems = this.getBackwardItems();
        this.fillForwardItems = this.getFillForwardItems();
        this.forwardItems = this.getForwardItems();
    }

    private thereIsGapBackwards (): boolean {
        return this.currentPage > 4;
    }

    private thereIsGapForward (): boolean {
        return this.currentPage < (this._total - 4);
    }

    private getFillBackwardItems (): Array<number> {
        if (this.thereIsGapBackwards()) {
            return [];
        }
        const items: Array<number> = [];
        for (let i = 1; i < this.currentPage; i++) {
            if (i === this.currentPage) {
                continue;
            }
            items.push(i);
        }
        return items;
    }

    private getFillForwardItems (): Array<number> {
        if (this.thereIsGapForward()) {
            return [];
        }
        const items = [];
        for (let i = this.currentPage; i < this._total; i++) {
            items.push(i + 1);
        }
        return items;
    }

    private getBackwardItems (): Array<number> {
        return this.thereIsGapBackwards() ? [
            1,
            2,
            3,
            -1,
            this.currentPage - 1
        ] : [];
    }

    private getForwardItems (): Array<number> {
        return this.thereIsGapForward() ? [
            this.currentPage + 1,
            this.currentPage + 2,
            -1,
            this.currentPage - 2,
            this.currentPage - 1,
            this._total
        ] : [];
    }
}
