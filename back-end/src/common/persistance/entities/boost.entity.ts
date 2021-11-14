export interface IKeyBoosterView {
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

export interface IBoostPaymentView {
    realmId: number;
    amount: number;
    faction: string;
    collectorDiscordId: string;
}

export interface IBoostKeyView {
    level: string | number;
    dungeon: string;
    isTimed: boolean;
    keyHolder: {
        discordId: string;
        role: string;
    };
}

export interface IBoostView {
    _id: string;
    name: null;
    boost: {
        name: string;
        realmId: number;
        source: string;
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
        realmId: number;
        role: string;
    };
    keys: Array<IBoostKeyView>;
    balancePayment?: number;
    payments: Array<IBoostPaymentView>;
}