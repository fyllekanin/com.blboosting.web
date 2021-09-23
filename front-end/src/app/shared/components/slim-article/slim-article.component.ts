import { Router } from '@angular/router';
import { Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { ARTICLE_DIFFICULTIES, ArticleClass } from '../../classes/media/article.class';

@Component({
    selector: 'app-slim-article',
    templateUrl: 'slim-article.component.html',
    styleUrls: ['slim-article.component.css']
})
export class SlimArticleComponent implements OnInit {
    @HostBinding('class.gray-bottom-shadow') lightDarkBottomShadow = true;
    @Input() article: ArticleClass;

    badgeCount = 0;
    firstBadge: string = null;
    difficulty: { name: string, color: string } = null;
    thumbnail: string;

    constructor(private router: Router) {
    }

    ngOnInit(): void {
        this.difficulty = ARTICLE_DIFFICULTIES[this.article.difficulty];
        this.badgeCount = this.article.badges.length;
        this.thumbnail = `/resources/article-thumbnails/${this.article.articleId}.gif?updatedAt=${this.article.updatedAt}`;

        const randomNumber = Math.floor((Math.random() * this.badgeCount));
        this.firstBadge = this.badgeCount > 0 ? this.article.badges[randomNumber] : null;
    }

    @HostListener('click', ['$event.target'])
    onClick(): void {
        this.router.navigateByUrl(`/default/article/${this.article.articleId}/page/1`);
    }
}
