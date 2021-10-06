import { verify } from 'jsonwebtoken';

export class RequestUtility {

    static getJWTValue(token: string): { id: string, discordId: string } {
        try {
            return verify(token, process.env.TOKEN_SECRET) as { id: string, discordId: string };
        } catch (_e) {
            return null;
        }
    }
}
