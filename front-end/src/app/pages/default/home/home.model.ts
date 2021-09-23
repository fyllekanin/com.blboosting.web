import { ArticleClass } from '../../../shared/classes/media/article.class';
import { HabboBadgeClass } from '../../../shared/classes/habbo-badge.class';
import { Slot } from '../../../shared/components/timetable/timetable.interface';
import { HomePageBannerEntry, HomePageStarLight } from '../../../shared/classes/home-page.class';

export interface HomeModel {
    badges: Array<HabboBadgeClass>;
    guides: Array<ArticleClass>;
    habboNews: Array<ArticleClass>;
    siteNews: Array<ArticleClass>;
    todayEvents: Array<Slot>;
    starLight: HomePageStarLight;
    bannerEntries: Array<HomePageBannerEntry>;
}
