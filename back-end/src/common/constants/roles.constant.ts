import { StringKeyValue } from '../utilities/object.interface';

export const Role: StringKeyValue<{ label: string, value: string }> = {
    TANK: {
        label: 'Tank',
        value: 'Tank'
    },
    HEALER: {
        label: 'Healer',
        value: 'Healer'
    },
    DPS: {
        label: 'DPS',
        value: 'DPS'
    }
}
