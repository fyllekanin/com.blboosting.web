import { StringKeyValue } from '../utilities/object.interface';

export const Permissions: StringKeyValue<number> = {
    CAN_LOGIN: 1,
    CAN_CREATE_BOOST: 2,
    CAN_REMOVE_BOOST: 4,
    CAN_MANAGE_GROUPS: 8
};
