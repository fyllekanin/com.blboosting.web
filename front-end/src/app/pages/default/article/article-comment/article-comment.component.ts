import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArticleComment } from '../article.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../../../core/auth/auth.service';
import { ArticleService } from '../article.service';

@Component({
    selector: 'app-default-article-comment',
    templateUrl: 'article-comment.component.html',
    styleUrls: ['article-comment.component.css']
})
export class ArticleCommentComponent {
    data = {} as ArticleComment;
    content: SafeHtml;

    canDelete = false;
    canUpdate = false;

    isEditing = false;

    @Output() onDelete: EventEmitter<number> = new EventEmitter();

    constructor(
        private authService: AuthService,
        private sanitizer: DomSanitizer,
        private service: ArticleService
    ) {
    }

    async onUpdate(): Promise<void> {
        const result = await this.service.updateComment(this.data.articleCommentId, this.data.content);
        if (result) {
            this.content = this.sanitizer.bypassSecurityTrustHtml(this.data.content);
            this.isEditing = false;
        }
    }

    @Input()
    set comment(comment: ArticleComment) {
        this.data = comment;
        this.content = this.sanitizer.bypassSecurityTrustHtml(comment.content);

        if (this.authService.isLoggedIn()) {
            this.canUpdate = this.data.user.userId === this.authService.getAuthUser().userId;
            this.canDelete = this.authService.getAuthUser().staffPermissions.CAN_MANAGE_ARTICLES;
        }
    }
}
