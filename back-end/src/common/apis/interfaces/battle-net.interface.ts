export interface BattleNetOauth2 {
    access_token: string;
    token_type: string;
}

export interface BattleNetRealm {
    name: string;
    id: number;
    slug: string;
    timezone: string;
    category: string;
    isTournament: boolean;
}


export interface SlimBattleNetRealm {
    name: string;
    id: number;
    slug: string;
}

export interface BattleNetRealms {
    realms: Array<SlimBattleNetRealm>;
}

export interface WoWCharacter {
    name: string;
    id: number;
    realm: {
        name: string;
        slug: string;
    };
    playable_class: {
        name: string;
        id: number;
    };
    playable_race: {
        name: string;
        id: number;
    };
    faction: {
        type: string;
        name: string;
    };
    level: number;
}

export interface BattleNetProfile {
    id: number;
    wow_accounts: Array<{
        id: number;
        characters: Array<WoWCharacter>
    }>
}