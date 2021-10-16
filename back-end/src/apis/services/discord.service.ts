import axios from 'axios';
import { URLSearchParams } from 'url';
import { DiscordOauth2, DiscordUser } from '../interfaces/discord.interface';

export class DiscordService {
    private static readonly BASE_URL = 'https://discord.com/api';

    static async getOauth(code: string): Promise<DiscordOauth2> {
        return await axios.post(`${DiscordService.BASE_URL}/oauth2/token`, new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: `${process.env.APPLICATION_URL}/api/oauth/discord`,
            scope: 'identify'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(result => result.data).catch(err => {
            console.error(`Discord oauth: ${err}`);
        });
    }

    static async getDiscordUser(data: { access_token: string, token_type: string }): Promise<DiscordUser> {
        return await axios.get(`${DiscordService.BASE_URL}/users/@me`, {
            headers: {
                authorization: `${data.token_type} ${data.access_token}`
            }
        }).then(result => result.data);
    }
}