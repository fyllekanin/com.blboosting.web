import { Controller, Get } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../utilities/internal.request';
import { Client } from 'discord.js';
import { DiscordService } from '../apis/services/discord.service';
import { sign } from 'jsonwebtoken';
import { UserRepository } from '../persistance/repositories/user/user.repository';
import { UserEntity } from '../persistance/entities/user/user.entity';
import { ValidationError } from '../constants/validation.error';

@Controller('api/oauth')
export class AuthenticationController {

    constructor(private client: Client) {
    }

    @Get('discord')
    async getDiscord(req: InternalRequest, res: Response): Promise<void> {
        if (!req.query.code) {
            res.redirect(process.env.DISCORD_OATH_LINK);
            return;
        }
        const result = await DiscordService.getDiscordOathResult(req.query.code as string);
        const discord = await DiscordService.getDiscordUser(result);

        const guild = this.client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
        const member = guild.members.cache.get(discord.id);

        const userRepository = new UserRepository();
        let user = await userRepository.getUserByDiscordId(discord.id);
        if (!user) {
            user = await userRepository.create(UserEntity.newBuilder().withDiscordId(discord.id).build());
        }

        const payload = member == null ? { error: ValidationError.NOT_IN_GUILD } : {
            error: 0,
            access_token: this.getAccessToken(user.id.toString()),
            refresh_token: this.getRefreshToken(user.id.toString()),
            user: {
                username: discord.username
            }
        };
        res.send(`
        <!DOCTYPE HTML>
        <html>
            <body>
                <script type="application/javascript">
                    window.parent.postMessage(${JSON.stringify(payload)}, '*');
                </script>
            </body>
        </html>
        `);
    }

    private getAccessToken(id: string): string {
        return sign({ id: id }, process.env.TOKEN_SECRET, { expiresIn: '2h' });
    }

    private getRefreshToken(id: string): string {
        return sign({ id: id }, process.env.TOKEN_SECRET, { expiresIn: '2d' });
    }
}
