import { Controller, Get, Middleware } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../../common/utilities/internal.request';
import { Client } from 'discord.js';
import { DiscordService } from '../../common/apis/services/discord.service';
import { sign } from 'jsonwebtoken';
import { UserRepository } from '../../common/persistance/repositories/user/user.repository';
import { IUserEntity } from '../../common/persistance/entities/user/user.entity';
import { ValidationError } from '../../common/constants/validation.error';
import { StatusCodes } from 'http-status-codes';
import { RequestUtility } from '../../common/utilities/request.utility';
import { AUTHORIZATION_MIDDLEWARE } from './middlewares/authorization.middleware';
import { RoleRepository } from '../../common/persistance/repositories/role.repository';
import { DiscordUser } from '../../common/apis/interfaces/discord.interface';
import { DiscordUtility } from '../../common/utilities/discord.utility';
import { ObjectId } from 'mongodb';
import { IRolePermissions } from '../../common/persistance/entities/role.entity';

interface AuthPayload {
    id: string;
    discordId: string;
    avatarHash: string;
    accessToken: string;
    refreshToken: string;
    username: string;
    permissions: IRolePermissions;
}

interface ErrorPayload {
    error: ValidationError;
}

@Controller('api/oauth')
export class AuthenticationController {

    @Get('initialize')
    @Middleware([AUTHORIZATION_MIDDLEWARE])
    async getInitialize(req: InternalRequest, res: Response): Promise<void> {
        try {
            const user = await UserRepository.newRepository().get(new ObjectId(req.user.id));
            if (!user) {
                res.status(StatusCodes.OK).json();
                return;
            }
            res.status(StatusCodes.OK).json({
                id: user._id.toString(),
                discordId: user.discordId,
                accessToken: this.getAccessToken(user._id, user.discordId),
                refreshToken: this.getRefreshToken(user._id, user.discordId),
                username: user.username,
                avatarHash: user.avatarHash,
                permissions: await RoleRepository.newRepository().getPermissions(user.discordId, DiscordUtility.getRoleIds(req.client, user.discordId))
            });
        } catch (_e) {
            res.status(StatusCodes.BAD_REQUEST).json();
        }
    }


    @Get('refresh-token')
    async getRefreshedTokens(req: InternalRequest, res: Response): Promise<void> {
        try {
            const refreshToken = req.header('RefreshAuthorization');
            const jwt = RequestUtility.getJWTValue(refreshToken);
            if (!jwt) {
                res.status(StatusCodes.UNAUTHORIZED).json();
                return;
            }
            const user = await UserRepository.newRepository().getUserByDiscordId(jwt.discordId);
            res.status(StatusCodes.OK).json({
                id: user._id.toString(),
                discordId: user.discordId,
                accessToken: this.getAccessToken(user._id, user.discordId),
                refreshToken: this.getRefreshToken(user._id, user.discordId),
                username: user.username,
                avatarHash: user.avatarHash,
                permissions: await RoleRepository.newRepository().getPermissions(user.discordId, DiscordUtility.getRoleIds(req.client, user.discordId))
            });
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).send(err);
        }
    }

    @Get('discord')
    async getDiscord(req: InternalRequest, res: Response): Promise<void> {
        try {
            if (!req.query.code) {
                res.redirect(process.env.DISCORD_OAUTH_LINK);
                return;
            }
            const result = await DiscordService.getOauth(req.query.code as string);
            const discord = await DiscordService.getDiscordUser(result);

            const userRepository = new UserRepository();
            let user = await userRepository.getUserByDiscordId(discord.id);
            if (!user) {
                user = await userRepository.insert({
                    discordId: discord.id,
                    username: discord.username,
                    avatarHash: discord.avatar
                });
            } else {
                user = await userRepository.update({ ...user, ...{ avatarHash: discord.avatar } });
            }
            res.send(`
            <!DOCTYPE HTML>
            <html>
                <body>
                    <script type="application/javascript">
                        window.opener.postMessage(${JSON.stringify(await this.getPayload(req.client, user, discord))}, '${process.env.NODE_ENV === 'production' ? process.env.APPLICATION_URL : 'http://localhost:4200'}');
                    </script>
                </body>
            </html>
            `);
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).send(err);
        }
    }

    private async getPayload(client: Client, user: IUserEntity, discord: DiscordUser): Promise<{ payload: AuthPayload | ErrorPayload }> {
        const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
        const member = guild.members.cache.get(discord.id);

        if (!member) {
            return { payload: { error: ValidationError.NOT_IN_GUILD } };
        }
        const permissions = await RoleRepository.newRepository().getPermissions(user.discordId, DiscordUtility.getRoleIds(client, user.discordId));
        if (!permissions.CAN_LOGIN) {
            return { payload: { error: ValidationError.CAN_NOT_LOGIN } };
        }

        return {
            payload: {
                id: user._id.toString(),
                discordId: user.discordId,
                avatarHash: discord.avatar,
                accessToken: this.getAccessToken(user._id, user.discordId),
                refreshToken: this.getRefreshToken(user._id, user.discordId),
                username: discord.username,
                permissions: permissions
            }
        };
    }

    private getAccessToken(id: ObjectId, discordId: string): string {
        return sign({ id: id.toString(), discordId: discordId }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
    }

    private getRefreshToken(id: ObjectId, discordId: string): string {
        return sign({ id: id.toString(), discordId: discordId }, process.env.TOKEN_SECRET, { expiresIn: '2d' });
    }
}
