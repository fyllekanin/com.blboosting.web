import { Controller, Get } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../utilities/internal.request';
import { Client } from 'discord.js';
import { DiscordService } from '../apis/services/discord.service';
import { sign, verify } from 'jsonwebtoken';
import { UserRepository } from '../persistance/repositories/user/user.repository';
import { UserEntity } from '../persistance/entities/user/user.entity';
import { ValidationError } from '../constants/validation.error';
import { StatusCodes } from 'http-status-codes';

@Controller('api/oauth')
export class AuthenticationController {

    constructor(private client: Client) {
    }

    @Get('refresh-token')
    async getRefreshedTokens(req: InternalRequest, res: Response): Promise<void> {
        const refreshToken = req.header('RefreshAuthorization');
        const jwt = refreshToken ? verify(refreshToken, process.env.TOKEN_SECRET) as { id: string } : null;
        if (!jwt) {
            res.status(StatusCodes.UNAUTHORIZED);
            return;
        }
        let user = await UserRepository.newRepository().get(jwt.id);
        res.status(StatusCodes.OK).json({
            id: user.id,
            accessToken: this.getAccessToken(String(user.id)),
            refreshToken: this.getRefreshToken(String(user.id)),
            username: user.username
        });
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
            user = await userRepository.create(UserEntity.newBuilder()
                .withDiscordId(discord.id)
                .withUsername(discord.username)
                .build());
        }

        const payload = member == null ? { error: ValidationError.NOT_IN_GUILD } : {
            id: user.id,
            accessToken: this.getAccessToken(String(user.id)),
            refreshToken: this.getRefreshToken(String(user.id)),
            username: discord.username
        };
        res.send(`
        <!DOCTYPE HTML>
        <html>
            <body>
                <script type="application/javascript">
                    window.opener.postMessage(${JSON.stringify(payload)}, 'http://localhost:4200');
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
