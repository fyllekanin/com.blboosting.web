export interface UserAction {
    label: string;
    value: string | number;
    isHidden?: boolean;
    isActive?: boolean;
}

export enum ValidationError {
    NOT_IN_GUILD = 1,
    CAN_NOT_LOGIN = 2,
    KEY_BOOST_NAME = 3,
    KEY_BOOST_REALM = 4,
    KEY_BOOST_SOURCE = 5,
    KEY_PLAY_ALONG_REALM = 6,
    KEY_PLAY_ALONG_ROLE = 7,
    KEY_PLAY_ALONG_KEY_HOLDER = 8,
    KEY_PAYMENT_AMOUNT = 9,
    KEY_PAYMENT_REALM = 10,
    KEY_PAYMENT_FACTION = 11,
    KEY_KEY_LEVEL = 12,
    KEY_KEY_DUNGEON = 13,
    KEY_KEY_HOLDER = 14,
    KEY_PAYMENT_BALANCE = 15
}