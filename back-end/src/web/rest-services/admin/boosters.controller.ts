import { Controller, Get } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../../../common/utilities/internal.request';
import { StatusCodes } from 'http-status-codes';
import { Configuration } from '../../../common/configuration';
import { Client, GuildMember } from 'discord.js';
import { IKeyBoosterView } from '../../rest-service-views/admin/boosts.interface';
import { PaginationHelper } from '../../helpers/pagination.helper';

@Controller('api/admin/boosters')
export class BoostersController {

    @Get('key/page/:page')
    async getList(req: InternalRequest, res: Response): Promise<void> {
        const boosters: Array<IKeyBoosterView> = await this.getKeyBoosters(req.client, {
            name: <string>req.query.name,
            armors: <Array<string>>req.query.armors,
            classes: <Array<string>>req.query.classes
        });

        res.status(StatusCodes.OK).json({
            page: Number(req.params.page),
            total: PaginationHelper.getTotalAmountOfPages(20, boosters.length),
            items: boosters.slice((Number(req.params.page) - 1) * 20, Number(req.params.page) * 20)
        });
    }

    private isValidArmor(user: GuildMember, armors: Array<string>): boolean {
        for (const armor of armors) {
            // @ts-ignore
            if (user.roles.cache.get(Configuration.get().ArmorRoles[armor.toUpperCase()].discordId)) {
                return true;
            }
        }
        return false;
    }

    private isValidClass(user: GuildMember, classes: Array<string>): boolean {
        for (const clazz of classes) {
            // @ts-ignore
             if (user.roles.cache.get(Configuration.get().ClassRoles[clazz.toUpperCase()].discordId)) {
                return true;
            }
        }
        return false;
    }

    private isValidName(search: string, name: string): boolean {
        return new RegExp(`^${search}`, 'i').test(name);
    }

    private async getKeyBoosters(client: Client, filters: { name: string, armors: Array<string>, classes: Array<string> }): Promise<Array<IKeyBoosterView>> {
        const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
        const response: Array<IKeyBoosterView> = [];
        (await guild.roles.fetch(Configuration.get().RoleIds.LOW_KEY_BOOSTER)).members.forEach(item => {
            const name = item.nickname ? item.nickname : item.displayName;
            if (filters.name && !this.isValidName(filters.name, name)) return;
            if ((filters.armors || []).length > 0 && !this.isValidArmor(item, filters.armors)) return;
            if ((filters.classes || []).length > 0 && !this.isValidClass(item, filters.classes)) return;
            
            const data: IKeyBoosterView = {
                discordId: item.id,
                name: name
            };
            response.push(data);
        });

        return response;
    }
}
