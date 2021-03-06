import { ILabelValue } from '../common.interface';

export interface IKeyBoosterView {
    discordId: string;
    name: string;
}

export interface IBoostRealm {
    realmId: number,
    name: string,
    category: string;
}

export interface IBoostPaymentView {
    realm: ILabelValue<IBoostRealm>;
    amount: number;
    faction: ILabelValue<string>;
    collector: ILabelValue<string>;
}

export interface IBoostKeyView {
    level: ILabelValue<string | number>;
    dungeon: ILabelValue<{ name: string, value: string, levels: Array<ILabelValue<string | number>> }>;
    isTimed: boolean;
    keyHolder: {
        user: ILabelValue<string>;
        role: ILabelValue<string>;
    };
}

export interface IBoostView {
    _id: string;
    name: null;
    boost: {
        name: string;
        realm: ILabelValue<IBoostRealm>;
        source: ILabelValue<string>;
        discount: number;
        armor: {
            cloth: boolean,
            leather: boolean,
            mail: boolean,
            plate: boolean
        };
        class: {
            warrior: boolean,
            paladin: boolean,
            hunter: boolean,
            rogue: boolean,
            priest: boolean,
            shaman: boolean,
            mage: boolean,
            warlock: boolean,
            monk: boolean,
            druid: boolean,
            demonHunter: boolean,
            deathKnight: boolean
        };
        note?: string;
    };
    playAlong: {
        isPlaying: boolean;
        name: string;
        realm: ILabelValue<IBoostRealm>;
        role: ILabelValue<string>;
    };
    keys: Array<IBoostKeyView>;
    balancePayment?: number;
    payments: Array<IBoostPaymentView>;
}
