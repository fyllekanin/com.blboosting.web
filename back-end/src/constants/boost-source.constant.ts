import { StringKeyValue } from '../utilities/object.interface';

export const BoostSource: StringKeyValue<{ label: string, value: string }> = {
    TRADE_CHAT: {
        label: 'Trade Chat',
        value: 'TRADE_CHAT'
    },
    TICKET_IN_HOUSE: {
        label: 'Ticket In-house',
        value: 'TICKET_IN_HOUSE'
    },
    TICKET_CLIENT: {
        label: 'Ticket Client',
        value: 'TICKET_CLIENT'
    },
    DISCORD: {
        label: 'Discord',
        value: 'DISCORD'
    }
}
