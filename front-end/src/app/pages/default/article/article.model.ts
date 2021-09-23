import { ArticleClass } from '../../../shared/classes/media/article.class';
import { HabboBadgeClass } from '../../../shared/classes/habbo-badge.class';
import { SlimUser } from '../../../shared/classes/slim-user.class';

export interface ArticleComment {
    articleCommentId: number;
    user: SlimUser;
    content: string;
}

export interface ArticlePage {
    article: ArticleClass;
    badges: Array<HabboBadgeClass>;
    isCompleted: boolean;
    comments: Array<ArticleComment>;
}
