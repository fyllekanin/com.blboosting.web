import { SlimUser } from './slim-user.class';

export interface HomePageStarLight {
    user: SlimUser;
    text: string;
}

export interface HomePageBannerEntry {
    id: string;
    caption: string;
    isDeleted: boolean;
    isUpdated: boolean;
    isNew: boolean;
}
