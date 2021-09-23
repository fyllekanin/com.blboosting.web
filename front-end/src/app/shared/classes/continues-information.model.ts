import { SlimUser } from './slim-user.class';

export interface RadioStats {
    listeners: number;
    song: string;
    currentDj: SlimUser;
    nextDj: SlimUser;
}

export interface ContinuesInformationModel {
    radioStats: RadioStats;
}
