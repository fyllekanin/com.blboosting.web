import { Controller, Get, Middleware } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../utilities/internal.request';
import { Client } from 'discord.js';
import { DiscordService } from '../apis/services/discord.service';
import { sign } from 'jsonwebtoken';
import { UserRepository } from '../persistance/repositories/user/user.repository';
import { IUserEntity, UserEntity } from '../persistance/entities/user/user.entity';
import { ValidationError } from '../constants/validation.error';
import { StatusCodes } from 'http-status-codes';
import { RequestUtility } from '../utilities/request.utility';
import { AUTHORIZATION_MIDDLEWARE } from './middlewares/authorization.middleware';
import { RoleRepository } from '../persistance/repositories/role.repository';
import { DiscordUser } from '../apis/interfaces/discord.interface';
import { RolePermissions } from '../persistance/entities/role.entity';
import { DiscordUtility } from '../utilities/discord.utility';

interface AuthPayload {
    id: string;
    discordId: string;
    avatarHash: string;
    accessToken: string;
    refreshToken: string;
    username: string;
    permissions: RolePermissions;
}

interface ErrorPayload {
    error: ValidationError;
}

@Controller('api/oauth')
export class AuthenticationController {

    @Get('initialize')
    @Middleware([AUTHORIZATION_MIDDLEWARE])
    async getInitialize(req: InternalRequest, res: Response): Promise<void> {

        let user = await UserRepository.newRepository().get(req.user.id);
        res.status(StatusCodes.OK).json({
            discordId: user.discordId,
            accessToken: this.getAccessToken(user._id, user.discordId),
            refreshToken: this.getRefreshToken(user._id, user.discordId),
            username: user.username,
            avatarHash: user.avatarHash,
            permissions: await RoleRepository.newRepository().getPermissions(user.discordId, DiscordUtility.getRoleIds(req.client, user.discordId))
        });
    }

    @Get('refresh-token')
    async getRefreshedTokens(req: InternalRequest, res: Response): Promise<void> {
        const refreshToken = req.header('RefreshAuthorization');
        const jwt = RequestUtility.getJWTValue(refreshToken);
        if (!jwt) {
            res.status(StatusCodes.UNAUTHORIZED).json();
            return;
        }
        let user = await UserRepository.newRepository().getUserByDiscordId(jwt.id);
        res.status(StatusCodes.OK).json({
            id: user._id,
            discordId: user.discordId,
            accessToken: this.getAccessToken(String(user._id), user.discordId),
            refreshToken: this.getRefreshToken(String(user._id), user.discordId),
            username: user.username,
            avatarHash: user.avatarHash,
            permissions: await RoleRepository.newRepository().getPermissions(user.discordId, DiscordUtility.getRoleIds(req.client, user.discordId))
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
        res.send(`
        <!DOCTYPE HTML>
        <html>
            <body>
                <script type="application/javascript">
                    window.opener.postMessage(${JSON.stringify(await this.getPayload(req.client, user, discord))}, 'http://localhost:4200');
                </script>
            </body>
        </html>
        `);
    }

    private async getPayload(client: Client, user: IUserEntity, discord: DiscordUser): Promise<AuthPayload | ErrorPayload> {
        const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
        const member = guild.members.cache.get(discord.id);

        if (!member) {
            return {error: ValidationError.NOT_IN_GUILD};
        }
        const permissions = await RoleRepository.newRepository().getPermissions(user.discordId, DiscordUtility.getRoleIds(client, user.discordId));
        if (!permissions.CAN_LOGIN) {
            return {error: ValidationError.CAN_NOT_LOGIN};
        }

        return {
            id: user._id,
            discordId: user.discordId,
            avatarHash: discord.avatar,
            accessToken: this.getAccessToken(user._id, user.discordId),
            refreshToken: this.getRefreshToken(user._id, user.discordId),
            username: discord.username,
            permissions: permissions
        };
    }

    private getAccessToken(id: string, discordId: string): string {
        return sign({id: id, discordId: discordId}, process.env.TOKEN_SECRET, {expiresIn: '2h'});
    }

    private getRefreshToken(id: string, discordId: string): string {
        return sign({id: id, discordId: discordId}, process.env.TOKEN_SECRET, {expiresIn: '2d'});
    }
}
