import { SlimUser } from '../slim-user.class';

export const ARTICLE_TYPES = {
    0: {
        name: 'Guide',
        isBadgeIncluded: true
    },
    1: {
        name: 'News',
        isBadgeIncluded: false
    },
    2: {
        name: 'Site News',
        isBadgeIncluded: false
    }
};

export const ARTICLE_DIFFICULTIES = {
    0: {
        name: 'None',
        color: null
    },
    1: {
        name: 'Easy',
        color: 'green'
    },
    2: {
        name: 'Medium',
        color: 'blue'
    },
    3: {
        name: 'Hard',
        color: 'red'
    }
};

export interface ArticleClass {
    articleId: number;
    user: SlimUser;
    title: string;
    parsedContent: string;
    content: string;
    badges: Array<string>;
    room: string;
    roomOwner: string;
    difficulty: number;
    type: number;
    isApproved: boolean;
    isAvailable: boolean;
    isPaid: boolean;
    updatedAt: number;
}
