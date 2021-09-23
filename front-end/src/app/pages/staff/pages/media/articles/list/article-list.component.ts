import { Component, OnDestroy } from '@angular/core';
import { TableActionResponse, TableHeader, TableRow } from '../../../../../../shared/components/table/table.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CombineSubscriptions, UnSub } from '../../../../../../shared/decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';
import { IPagination, IPaginationResolver } from '../../../../../../shared/components/pagination/pagination.model';
import { ARTICLE_TYPES, ArticleClass } from '../../../../../../shared/classes/media/article.class';
import { ArticleService } from '../article/article.service';
import { DialogService } from '../../../../../../core/common-services/dialog.service';
import { SearchablePage } from '../../../../../../shared/classes/searchable-page.class';

@Component({
    selector: 'app-staff-articles-article-list',
    templateUrl: 'article-list.component.html'
})
@UnSub()
export class ArticleListComponent extends SearchablePage implements OnDestroy {
    private readonly ACTIONS = {
        EDIT: 'edit',
        APPROVE: 'approve',
        UNAPPROVE: 'unapprove',
        DELETE: 'delete'
    };

    contentActions = [{label: 'Create new', value: 'createNew'}];
    data: IPagination<ArticleClass>;
    @CombineSubscriptions()
    subscriber: Unsubscribable;

    rows: Array<TableRow> = [];
    headers: Array<TableHeader> = [
        {label: 'Title'},
        {label: 'Type'},
        {label: 'Author'},
        {label: 'Is Approved'}
    ];

    params = {
        title: undefined,
        type: undefined,
        isApproved: undefined,
        isExactSearch: false
    };

    constructor(
        private articleService: ArticleService,
        private dialogService: DialogService,
        protected router: Router,
        protected activatedRoute: ActivatedRoute
    ) {
        super();
        this.params.title = activatedRoute.snapshot.queryParams.isApproved;
        this.params.type = activatedRoute.snapshot.queryParams.type;
        this.params.isApproved = activatedRoute.snapshot.queryParams.isApproved;

        this.subscriber = activatedRoute.data.subscribe(this.onData.bind(this));
    }

    onAction(response: TableActionResponse): void {
        switch (response.action.value) {
            case this.ACTIONS.EDIT:
                this.router.navigateByUrl(`/staff/media/articles/${response.row.rowId}`);
                break;
            case this.ACTIONS.DELETE:
                this.onDelete(response.row.rowId as number);
                break;
            case this.ACTIONS.APPROVE:
                this.onApprove(response.row.rowId as number);
                break;
            case this.ACTIONS.UNAPPROVE:
                this.onUnapprove(response.row.rowId as number);
                break;
        }
    }

    onCreateNew(): void {
        this.router.navigateByUrl(`/staff/media/articles/new`);
    }

    ngOnDestroy(): void {
        // Empty
    }

    private async onApprove(articleId: number): Promise<void> {
        await this.articleService.approve(articleId);
        const article = this.data.items.find(item => item.articleId === articleId);
        article.isApproved = true;
        this.rows = this.getRows();
    }

    private async onUnapprove(articleId: number): Promise<void> {
        await this.articleService.unapprove(articleId);
        const article = this.data.items.find(item => item.articleId === articleId);
        article.isApproved = false;
        this.rows = this.getRows();
    }

    private async onDelete(articleId: number): Promise<void> {
        const confirmed = await this.dialogService.confirm('Do you really wanna delete this article?');
        if (confirmed) {
            await this.articleService.delete(articleId);
            this.rows = this.rows.filter(row => row.rowId !== articleId);
        }
    }

    private onData({pagination}: IPaginationResolver<ArticleClass>): void {
        this.data = pagination;
        this.rows = this.getRows();
    }

    private getRows(): Array<TableRow> {
        return this.data.items.map(item => ({
            rowId: item.articleId,
            actions: [
                {
                    label: 'Edit',
                    value: this.ACTIONS.EDIT
                },
                {
                    label: item.isApproved ? 'Unapprove' : 'Approve',
                    value: item.isApproved ? this.ACTIONS.UNAPPROVE : this.ACTIONS.APPROVE
                },
                {
                    label: 'Delete',
                    value: this.ACTIONS.DELETE
                }
            ],
            cells: [
                {label: item.title},
                {label: ARTICLE_TYPES[item.type]?.name || 'Unknown'},
                {label: item.user.username},
                {label: item.isApproved ? 'Yes' : 'No'}
            ]
        }));
    }
}
