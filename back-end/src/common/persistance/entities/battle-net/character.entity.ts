import { CreatedUpdatedAtEntity } from '../created-updated-at.interface';
import { ObjectId } from 'mongodb';

export interface ICharacter extends CreatedUpdatedAtEntity {
    _id?: ObjectId;
    userId: ObjectId;
    battleNetId: number;
    accountId: number;
    characterId: number;
    name: string;
    realmSlug: string;
    class: string;
    race: string;
    faction: string;
    level: number;
    characterAssets: {
        avatar: string;
        inset: string;
        main: string;
    },
    raiderIo?: {
        healer: number;
        tank: number;
        dps: number;
        all: number;
    }
    raid?: {
        bestPerformanceAverage: number
    }
}
