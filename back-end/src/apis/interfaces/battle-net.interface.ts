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
