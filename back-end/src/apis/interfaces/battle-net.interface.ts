export interface BattleNetOauth2 {
    access_token: string;
    token_type: string;
}

export interface BattleNetRealm {
    name: string;
    id: number;
    slug: string;
}

export interface BattleNetRealms {
    realms: Array<BattleNetRealm>;
}

export interface BattleNetConnectedRealm {
    id: number;
    realms: Array<BattleNetRealm>
}
