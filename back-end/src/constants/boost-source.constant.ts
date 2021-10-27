import { StringKeyValue } from '../utilities/object.interface';

export const BoostSource: StringKeyValue<{ label: string, value: string }> = {
    TRADE_CHAT: {
        label: 'Trade Chat',
        value: 'TC'
    },
    TICKET_IN_HOUSE: {
        label: 'Ticket In-house',
        value: 'TIH'
    },
    TICKET_CLIENT: {
        label: 'Ticket Client',
        value: 'TC'
    },
    DISCORD: {
        label: 'Discord',
        value: 'discord'
    }
}
