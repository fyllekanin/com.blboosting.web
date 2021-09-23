import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CombineSubscriptions, UnSub } from '../../../../../../shared/decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';
import {
    ARTICLE_DIFFICULTIES,
    ARTICLE_TYPES,
    ArticleClass
} from '../../../../../../shared/classes/media/article.class';
import { EditorComponent } from '../../../../../../shared/components/editor/editor.component';
import { UserAction } from '../../../../../../shared/constants/common.interfaces';
import { ArticleService } from './article.service';
import { DialogService } from '../../../../../../core/common-services/dialog.service';

@Component({
    selector: 'app-staff-articles-article',
    templateUrl: 'article.component.html',
    styleUrls: ['article.component.css']
})
@UnSub()
export class ArticleComponent implements AfterViewInit, OnDestroy {
    private readonly ACTIONS = {
        SAVE: 'save',
        DELETE: 'delete',
        BACK: 'back'
    };
    actions: Array<UserAction> = [];
    data = {} as ArticleClass;
    @CombineSubscriptions()
    subscriber: Unsubscribable;

    types: Array<{ label: string, value: number, isBadgeIncluded: boolean }> = [];
    difficulties: Array<{ label: string, value: number }> = [];
    showBadges = false;
    badges = '';
    @ViewChild(EditorComponent, {static: true}) editorComponent: EditorComponent;
    @ViewChild('fileElement', {static: true}) fileElementRef: ElementRef<HTMLInputElement>;

    constructor(
        private service: ArticleService,
        private router: Router,
        private dialogService: DialogService,
        activatedRoute: ActivatedRoute
    ) {
        this.subscriber = activatedRoute.data.subscribe(this.onData.bind(this));
        this.types = Object.keys(ARTICLE_TYPES).map(key => {
            const type = ARTICLE_TYPES[key];
            return {label: type.name, value: Number(key), isBadgeIncluded: type.isBadgeIncluded};
        });
        this.difficulties = Object.keys(ARTICLE_DIFFICULTIES).map(key => {
            const difficulty = ARTICLE_DIFFICULTIES[key];
            return {label: difficulty.name, value: Number(key)};
        });
    }

    onBadgesChange(): void {
        this.data.badges = this.badges.split(',')
            .map(badge => badge.trim())
            .filter(badge => Boolean(badge));
    }

    ngOnDestroy(): void {
        // Empty
    }

    onTypeChange(): void {
        return ARTICLE_TYPES[this.data.type]?.isBadgeIncluded || false;
    }

    async onAction(action: UserAction): Promise<void> {
        switch (action.value) {
            case this.ACTIONS.BACK:
                await this.router.navigateByUrl('/staff/media/articles/page/1');
                break;
            case this.ACTIONS.SAVE:
                await this.onSave();
                break;
            case this.ACTIONS.DELETE:
                await this.onDelete();
                break;
        }
    }

    ngAfterViewInit(): void {
        this.editorComponent.setContent(this.data.content);
    }

    private async onSave(): Promise<void> {
        if (!this.showBadges) {
            this.data.badges = [];
            this.data.room = null;
            this.data.roomOwner = null;
            this.data.difficulty = 0;
            this.data.isAvailable = false;
            this.data.isPaid = false;
        }

        this.data.content = this.editorComponent.getContent();
        const articleId = await this.service.save(this.data, this.fileElementRef.nativeElement);
        this.data.articleId = articleId as number;
        this.actions = this.getActions();
    }

    private async onDelete(): Promise<void> {
        const confirmed = await this.dialogService.confirm('Do you really wanna delete this article?');
        if (confirmed) {
            await this.service.delete(this.data.articleId);
            await this.router.navigateByUrl('/staff/media/articles/page/1');
        }
    }

    private onData({data}: { data: ArticleClass }): void {
        this.data = data;
        this.badges = this.data.badges.join(',');
        this.actions = this.getActions();
        this.showBadges = ARTICLE_TYPES[this.data.type]?.isBadgeIncluded || false;
    }

    private getActions(): Array<UserAction> {
        return [
            {label: 'Save', value: this.ACTIONS.SAVE, isAvailable: true},
            {label: 'Delete', value: this.ACTIONS.DELETE, isAvailable: Boolean(this.data.articleId)},
            {label: 'Go back', value: this.ACTIONS.BACK, isAvailable: true}
        ].filter(action => action.isAvailable).map(action => {
            delete action.isAvailable;
            return action;
        });
    }
}
