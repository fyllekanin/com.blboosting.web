import { HomePageBannerEntry, HomePageStarLight } from '../../../../../shared/classes/home-page.class';

export interface HomePageSettingsModel {
    starLight: HomePageStarLight;
    bannerEntries: Array<HomePageBannerEntry>;
}
