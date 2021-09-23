import { CombineSubscriptions, UnSub } from '../../../shared/decorators/unsub.decorator';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { Unsubscribable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ArticlePage } from './article.model';
import { ArticleService } from './article.service';
import { AuthService } from '../../../core/auth/auth.service';
import { UserAction } from '../../../shared/constants/common.interfaces';
import { DialogService } from '../../../core/common-services/dialog.service';

@Component({
    selector: 'app-default-article',
    templateUrl: 'article.component.html',
    styleUrls: ['article.component.css']
})
@UnSub()
export class ArticleComponent implements OnDestroy {
    data = {} as ArticlePage;

    @CombineSubscriptions()
    subscriber: Unsubscribable;
    sanitizedContent: SafeHtml;
    isLoggedIn: boolean;
    newCommentContent = '';

    postCommentAction: Array<UserAction> = [
        {label: 'Create', value: 'create'}
    ];

    constructor(
        private service: ArticleService,
        private sanitizer: DomSanitizer,
        private dialogService: DialogService,
        authService: AuthService,
        activatedRoute: ActivatedRoute
    ) {
        this.isLoggedIn = authService.isLoggedIn();
        this.subscriber = activatedRoute.data.subscribe(this.onData.bind(this));
    }

    ngOnDestroy(): void {
        // Empty
    }

    async onDeleteComment(articleCommentId: number): Promise<void> {
        const result = await this.dialogService.confirm('Do you really wanna delete this comment?');
        if (result) {
            const isDeleted = await this.service.deleteComment(articleCommentId);
            if (isDeleted) {
                this.data.comments = this.data.comments.filter(comment => comment.articleCommentId !== articleCommentId);
            }
        }
    }

    async onCreateComment(): Promise<void> {
        const result = await this.service.createComment(this.data.article.articleId, this.newCommentContent);
        if (!result) {
            return;
        }
        this.data.comments = [result].concat(this.data.comments);
        this.newCommentContent = '';
    }

    async markComplete(): Promise<void> {
        await this.service.markAsComplete(this.data.article.articleId);
        this.data.isCompleted = true;
    }

    private onData({data}: { data: ArticlePage }): void {
        this.data = data;
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.data.article.parsedContent);
    }
}
