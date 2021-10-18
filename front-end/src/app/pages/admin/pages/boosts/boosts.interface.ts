import { SelectItem } from '../../../../shared/components/form/select/select.interface';

export interface BoostContext {
    realms: Array<{ realmId: number, name: string, category: string }>;
    sources: Array<string>;
    classes: Array<string>;
    dungeons: Array<string>;
    armors: Array<string>;
    roles: Array<string>;
}

export interface IBoost {
    boost: {
        name: string;
        realm: SelectItem;
        source: string;
    };
}
