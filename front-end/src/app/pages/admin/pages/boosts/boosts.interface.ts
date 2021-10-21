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
    faction: string;
}

export interface IBoostKey {
    level: number | string;
    dungeon: string;
    isTimed: boolean;
    keyHolder: {
        discordId: string;
        role: string;
    };
}

export interface IBoost {
    _id: string;
    name: null;
    boost: {
        name: string;
        realm: SelectItem;
        source: string;
        armor: string;
        class: string;
        note?: string;
    };
    playAlong: {
        name: string;
        realm: SelectItem;
        role: string;
    };
    keys: Array<IBoostKey>;
    balancePayment?: number;
    payments: Array<IBoostPayment>;
}
