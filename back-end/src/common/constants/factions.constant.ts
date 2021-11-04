import { StringKeyValue } from '../utilities/object.interface';

export const Faction: StringKeyValue<{ label: string, value: string }> = {
    HORDE: {
        label: 'Horde',
        value: 'HORDE'
    },
    ALLIANCE: {
        label: 'Alliance',
        value: 'ALLIANCE'
    }
}
