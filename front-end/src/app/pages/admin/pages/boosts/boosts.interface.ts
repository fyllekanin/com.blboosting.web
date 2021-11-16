import { SelectItem } from '../../../../shared/components/form/select/select.interface';

export interface IBooster {
    discordId: string;
    name: string;
    armors: {
        cloth: boolean,
        leather: boolean,
        mail: boolean,
        plate: boolean
    };
    classes: {
        priest: boolean,
        warlock: boolean,
        mage: boolean,
        druid: boolean,
        monk: boolean,
        rogue: boolean,
        demonHunter: boolean,
        hunter: boolean,
        shaman: boolean,
        warrior: boolean,
        deathKnight: boolean,
        paladin: boolean
    };
}

export interface BoostContext {
    canCollectPayment: boolean;
    realms: Array<{ realmId: number, name: string, category: string }>;
    sources: Array<SelectItem<string>>;
    dungeons: Array<{ name: string, value: string, levels: Array<SelectItem> }>;
    roles: Array<SelectItem<string>>;
    factions: Array<SelectItem<string>>;
    collectors: Array<SelectItem<string>>;
}

export interface IBoostPayment {
    realm: SelectItem;
    amount: number;
    faction: SelectItem;
    collector?: SelectItem<string>;
    isMandatory: boolean;
}

export interface IBoostKey {
    level: SelectItem;
    dungeon: SelectItem;
    isTimed: boolean;
    isTimedDisabled?: boolean;
    keyHolder: {
        user: SelectItem;
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
        role: SelectItem;
    };
    keys: Array<IBoostKey>;
    balancePayment?: number;
    payments: Array<IBoostPayment>;
}
