import { SlimUser } from './../../../../../shared/classes/slim-user.class';

export interface RadioRequest {
    radioRequestId: number;
    user: SlimUser;
    request: string;
    createdAt: string;
}
