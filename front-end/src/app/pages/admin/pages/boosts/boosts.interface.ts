import { SelectItem } from '../../../../shared/components/form/select/select.interface';

export interface BoostContext {
    realms: Array<{ realmId: number, name: string, category: string }>;
    sources: Array<string>;
    classes: Array<string>;
    dungeons: Array<string>;
    armors: Array<string>;
    roles: Array<string>;
    factions: Array<string>;
}

export interface IBoostPayment {
    realm: SelectItem;
    amount: number;
    faction: SelectItem;
}

export interface IBoostKey {
    level: number | string;
    dungeon: SelectItem;
    isTimed: boolean;
    keyHolder: {
        discordId: string;
        role: SelectItem;
    };
}

export interface IBoost {
    _id: string;
    name: null;
    boost: {
        name: string;
        realm: SelectItem;
        source: SelectItem;
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
        name: string;
        realm: SelectItem;
        role: SelectItem;
    };
    keys: Array<IBoostKey>;
    balancePayment?: number;
    payments: Array<IBoostPayment>;
}
