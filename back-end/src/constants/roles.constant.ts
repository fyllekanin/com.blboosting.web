import { StringKeyValue } from '../utilities/object.interface';

export const Role: StringKeyValue<{ label: string, value: string }> = {
    TANK: {
        label: 'Tank',
        value: 'TANK'
    },
    HEALER: {
        label: 'Healer',
        value: 'HEALER'
    },
    DPS: {
        label: 'DPS',
        value: 'DPS'
    }
}
