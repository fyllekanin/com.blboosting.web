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

export interface BattleNetProfile {
    id: number;
    wow_accounts: Array<{
        id: number;
        characters: Array<{
            name: string;
            id: number;
            realmSlug: string;
            class: string;
            race: string;
            faction: string;
            level: number;
        }>
    }>
}