import { Component, OnDestroy } from '@angular/core';
import { CombineSubscriptions, UnSub } from '../../../shared/decorators/unsub.decorator';
import { IPagination } from '../../../shared/components/pagination/pagination.model';
import { ArticleClass } from '../../../shared/classes/media/article.class';
import { Unsubscribable } from 'rxjs';
import { SearchablePage } from '../../../shared/classes/searchable-page.class';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-default-articles',
    templateUrl: 'articles.component.html',
    styleUrls: ['articles.component.css']
})
@UnSub()
export class ArticlesComponent extends SearchablePage implements OnDestroy {
    data: IPagination<ArticleClass>;
    @CombineSubscriptions()
    subscriber: Unsubscribable;

    params = {
        difficulty: undefined,
        type: undefined,
        isAvailable: undefined,
        isPaid: undefined
    };

    constructor (
        protected router: Router,
        protected activatedRoute: ActivatedRoute
    ) {
        super();
        this.subscriber = activatedRoute.data.subscribe(this.onData.bind(this));
        this.params.difficulty = activatedRoute.snapshot.queryParams.difficulty;
        this.params.type = activatedRoute.snapshot.queryParams.type;
        this.params.isAvailable = activatedRoute.snapshot.queryParams.isAvailable;
        this.params.isPaid = activatedRoute.snapshot.queryParams.isPaid;
    }

    ngOnDestroy (): void {
        // Empty
    }

    private onData ({ data }: { data: IPagination<ArticleClass> }): void {
        this.data = data;
    }
}
