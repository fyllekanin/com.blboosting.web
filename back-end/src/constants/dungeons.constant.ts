import { StringKeyValue } from '../utilities/object.interface';

const keyLevels: Array<{ label: string, value: number }> = [];
for (let i = 0; i < 31; i++) {
    keyLevels.push({ label: `+${i}`, value: i });
}
export const Dungeon: StringKeyValue<{ name: string, value: string, levels: Array<{ label: string, value: string | number }> }> = {
    ANY: {
        name: 'Any',
        value: 'ANY',
        levels: keyLevels
    },
    DOS: {
        name: 'De Other Side',
        value: 'DOS',
        levels: keyLevels
    },
    HOA: {
        name: 'Halls of Atonement',
        value: 'HOA',
        levels: keyLevels
    },
    MIST: {
        name: 'Mists of Tirna Scithe',
        value: 'MIST',
        levels: keyLevels
    },
    PF: {
        name: 'Plaguefall',
        value: 'PLEAGUE',
        levels: keyLevels
    },
    SD: {
        name: 'Sanguine Depths',
        value: 'SD',
        levels: keyLevels
    },
    SOA: {
        name: 'Spires of Ascension',
        value: 'SOA',
        levels: keyLevels
    },
    NW: {
        name: 'The Necrotic Wake',
        value: 'NW',
        levels: keyLevels
    },
    TOP: {
        name: 'Theater of Pain',
        value: 'TOP',
        levels: keyLevels
    },
    TAZA: {
        name: 'Tazavesh, the Veiled Market',
        value: 'TAZ',
        levels: [
            { label: 'Mythic', value: 'MYTHIC' },
            { label: 'Hard mode', value: 'HARD_MODE' }
        ]
    }
}
