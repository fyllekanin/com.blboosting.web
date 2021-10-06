import { Request } from 'express';
import { Client } from 'discord.js';

export interface InternalUser {
    id: string | null;
    discordId: string | null;
    token: string | null;
}

export interface InternalRequest extends Request {
    user: InternalUser;
    client: Client;
}
