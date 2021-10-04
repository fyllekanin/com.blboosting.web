import { Request } from 'express';

export interface InternalUser {
    id: string | null;
    discordId: string | null;
    token: string | null;
}

export interface InternalRequest extends Request {
    user: InternalUser;
}
