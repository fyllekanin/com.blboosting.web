import NodeCache from 'node-cache';

interface IValue {
    label: string;
    value: string;
    discordId: string;
}

interface IConfiguration {
    ArmorRoles: {
        CLOTH: IValue;
        LEATHER: IValue;
        MAIL: IValue;
        PLATE: IValue;
    };
    ClassRoles: {
        PRIEST: IValue;
        WARLOCK: IValue;
        MAGE: IValue;
        DRUID: IValue;
        MONK: IValue;
        ROGUE: IValue;
        DEMON_HUNTER: IValue;
        HUNTER: IValue;
        SHAMAN: IValue;
        WARRIOR: IValue;
        PALADIN: IValue;
        DEATH_KNIGHT: IValue;
    };
    RoleIds: {
        LOW_KEY_BOOSTER: string;
        MEDIUM_KEY_BOOSTER: string;
        HIGH_KEY_BOOSTER: string;
        ELITE_KEY_BOOSTER: string;
    };
}

export class Configuration {
    private static config: IConfiguration;
    private static cache = new NodeCache({ stdTTL: 3600 });

    static loadConfig(environment: string): void {
        if (this.config) {
            throw new Error('Configuration is already loaded');
        }
        this.config = require(`./../web/resources/discord-config.${environment}.json`);
    }

    static get(): IConfiguration {
        if (!this.config) {
            throw new Error('Configuration is not loaded');
        }
        return Configuration.config;
    }

    static getCache(): NodeCache {
        return this.cache;
    }
}