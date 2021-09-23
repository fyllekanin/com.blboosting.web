import { HttpService } from './../../../core/http/http.service';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { ArticleComment, ArticlePage } from './article.model';
import { SiteNotificationService } from '../../../core/common-services/site-notification.service';
import { SiteNotificationType } from '../../../shared/app-views/site-notification/site-notification.interface';

@Injectable()
export class ArticleService implements Resolve<ArticlePage> {

    constructor(
        private siteNotificationService: SiteNotificationService,
        private httpService: HttpService
    ) {
    }

    resolve(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<ArticlePage> {
        return this.httpService.get(`/page/article/${activatedRouteSnapshot.params.articleId}/page/${activatedRouteSnapshot.params.page}`);
    }

    createComment(articleId: number, content: string): Promise<ArticleComment> {
        if (!content) {
            this.siteNotificationService.create({
                title: 'Error',
                message: 'Comment can not be empty',
                type: SiteNotificationType.ERROR
            });
            return;
        }
        return this.httpService.post(`/article-comment/${articleId}`, {content: content})
            .toPromise()
            .then(res => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'New comment made!',
                    type: SiteNotificationType.INFO
                });
                return res as ArticleComment;
            })
            .catch(error => {
                this.siteNotificationService.onError(error.error);
                return null;
            });
    }

    updateComment(articleCommentId: number, content: string): Promise<boolean> {
        return this.httpService.put(`/article-comment/${articleCommentId}`, {content: content})
            .toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Comment updated!',
                    type: SiteNotificationType.INFO
                });
                return true;
            })
            .catch(error => {
                this.siteNotificationService.onError(error.error);
                return false;
            });
    }

    deleteComment(articleCommentId: number): Promise<boolean> {
        return this.httpService.delete(`/article-comment/${articleCommentId}`)
            .toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Comment deleted!',
                    type: SiteNotificationType.INFO
                });
                return true;
            })
            .catch(error => {
                this.siteNotificationService.onError(error.error);
                return false;
            });
    }

    markAsComplete(articleId: number): Promise<void> {
        return this.httpService.post(`/page/article/${articleId}/complete`, null).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'You have marked the involved badges complete!',
                    type: SiteNotificationType.INFO
                });
            })
            .catch(error => this.siteNotificationService.onError(error.error));
    }
}
