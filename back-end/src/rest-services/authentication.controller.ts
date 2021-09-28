import { Controller, Get, Middleware } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../utilities/internal.request';
import { Client } from 'discord.js';
import { DiscordService } from '../apis/services/discord.service';
import { sign } from 'jsonwebtoken';
import { UserRepository } from '../persistance/repositories/user/user.repository';
import { UserEntity } from '../persistance/entities/user/user.entity';
import { ValidationError } from '../constants/validation.error';
import { StatusCodes } from 'http-status-codes';
import { RequestUtility } from '../utilities/request.utility';
import { AUTHORIZATION_MIDDLEWARE } from './middlewares/authorization.middleware';

@Controller('api/oauth')
export class AuthenticationController {

    constructor(private client: Client) {
    }

    @Get('initialize')
    @Middleware([AUTHORIZATION_MIDDLEWARE])
    async getInitialize(req: InternalRequest, res: Response): Promise<void> {
        let user = await UserRepository.newRepository().get(req.user.id);
        res.status(StatusCodes.OK).json({
            discordId: user.discordId,
            accessToken: this.getAccessToken(user.id),
            refreshToken: this.getRefreshToken(user.id),
            username: user.username,
            avatarHash: user.avatarHash
        });
    }

    @Get('refresh-token')
    async getRefreshedTokens(req: InternalRequest, res: Response): Promise<void> {
        const refreshToken = req.header('RefreshAuthorization');
        const jwt = RequestUtility.getJWTValue(refreshToken);
        if (!jwt) {
            res.status(StatusCodes.UNAUTHORIZED);
            return;
        }
        let user = await UserRepository.newRepository().getUserByDiscordId(jwt.id);
        res.status(StatusCodes.OK).json({
            id: user.id,
            discordId: user.discordId,
            accessToken: this.getAccessToken(String(user.id)),
            refreshToken: this.getRefreshToken(String(user.id)),
            username: user.username,
            avatarHash: user.avatarHash
        });
    }

    @Get('discord')
    async getDiscord(req: InternalRequest, res: Response): Promise<void> {
        if (!req.query.code) {
            res.redirect(process.env.DISCORD_OAUTH_LINK);
            return;
        }
        const result = await DiscordService.getDiscordOathResult(req.query.code as string);
        const discord = await DiscordService.getDiscordUser(result);

        const guild = this.client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
        const member = guild.members.cache.get(discord.id);

        const userRepository = new UserRepository();
        let user = await userRepository.getUserByDiscordId(discord.id);
        if (!user) {
            user = await userRepository.save(UserEntity.newBuilder()
                .withDiscordId(discord.id)
                .withUsername(discord.username)
                .withAvatarHash(discord.avatar)
                .build());
        } else {
            user = await userRepository.save(UserEntity.newBuilderFrom(user).withAvatarHash(discord.avatar).build());
        }

        const payload = member == null ? { error: ValidationError.NOT_IN_GUILD } : {
            id: user.id,
            discordId: user.discordId,
            avatarHash: discord.avatar,
            accessToken: this.getAccessToken(user.id),
            refreshToken: this.getRefreshToken(user.id),
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
