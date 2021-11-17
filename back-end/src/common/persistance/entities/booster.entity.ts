import { ObjectId } from 'mongodb';

export interface IBooster {
    _id?: ObjectId;
    name: string;
    discordId: string;
    armors: {
        cloth: boolean;
        leather: boolean;
        mail: boolean;
        plate: boolean;
    };
    classes: {
        mage: boolean;
        priest: boolean;
        warlock: boolean;
        demonHunter: boolean;
        druid: boolean;
        monk: boolean;
        rogue: boolean;
        hunter: boolean;
        shaman: boolean;
        paladin: boolean;
        warrior: boolean;
        deathKnight: boolean;
    };
    boosterRoles: {
        isLow: boolean;
        isMedium: boolean;
        isHigh: boolean;
        isElite: boolean;
    }
}