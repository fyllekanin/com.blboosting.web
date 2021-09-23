import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ArticleClass } from '../../../../../../shared/classes/media/article.class';
import { Observable, of } from 'rxjs';
import { HttpService } from '../../../../../../core/http/http.service';
import { SiteNotificationService } from '../../../../../../core/common-services/site-notification.service';
import { SiteNotificationType } from '../../../../../../shared/app-views/site-notification/site-notification.interface';

@Injectable()
export class ArticleService implements Resolve<ArticleClass> {

    constructor(
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<ArticleClass> {
        if (route.params.articleId === 'new') {
            return of({} as ArticleClass);
        }
        return this.httpService.get(`/staff/articles/${route.params.articleId}`);
    }

    approve(articleId: number): Promise<void> {
        return this.httpService.put(`/staff/articles/${articleId}/approve`, null).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Article approved',
                    type: SiteNotificationType.SUCCESS
                });
            })
            .catch(() => {
                this.siteNotificationService.create({
                    title: 'Opss',
                    message: 'Something went wrong',
                    type: SiteNotificationType.ERROR
                });
                throw new Error();
            });
    }

    unapprove(articleId: number): Promise<void> {
        return this.httpService.put(`/staff/articles/${articleId}/unapprove`, null).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Article unapproved',
                    type: SiteNotificationType.SUCCESS
                });
            })
            .catch(() => {
                this.siteNotificationService.create({
                    title: 'Opss',
                    message: 'Something went wrong',
                    type: SiteNotificationType.ERROR
                });
                throw new Error();
            });
    }

    delete(articleId: number): Promise<void> {
        return this.httpService.delete(`/staff/articles/${articleId}`).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Article deleted',
                    type: SiteNotificationType.SUCCESS
                });
            })
            .catch(() => {
                this.siteNotificationService.create({
                    title: 'Opss',
                    message: 'Something went wrong',
                    type: SiteNotificationType.ERROR
                });
                throw new Error();
            });
    }

    save(article: ArticleClass, fileElement: HTMLInputElement): Promise<number | unknown> {
        const data = new FormData();
        data.append('article', JSON.stringify(article));
        data.append('thumbnail', fileElement.files[0]);
        if (article.articleId) {
            return this.httpService.post(`/staff/articles/${article.articleId}`, data).toPromise()
                .then(() => {
                    this.siteNotificationService.create({
                        title: 'Updated',
                        message: 'Article updated',
                        type: SiteNotificationType.INFO
                    });
                    return article.articleId;
                })
                .catch(error => {
                    this.siteNotificationService.onError(error.error);
                    return article.articleId;
                });
        } else {
            return this.httpService.post('/staff/articles', data).toPromise()
                .then(articleId => {
                    this.siteNotificationService.create({
                        title: 'Created',
                        message: 'Article created',
                        type: SiteNotificationType.INFO
                    });
                    return articleId;
                })
                .catch(error => {
                    this.siteNotificationService.onError(error.error);
                });
        }
    }
}
