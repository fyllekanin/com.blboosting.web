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
        const boosters: Array<IKeyBoosterView> = await this.getKeyBoosters(req.client).then(items => {
            return items.filter(item => {
                if (req.query.name && !this.isValidName(<string>req.query.name, item.name)) return false;
                if (req.query.armors && !this.isValidArmor(<Array<string>>req.query.armors, item)) return false;
                if (req.query.classes && !this.isValidClass(<Array<string>>req.query.classes, item)) return false;
                return true;
            });
        });

        res.status(StatusCodes.OK).json({
            page: Number(req.params.page),
            total: PaginationHelper.getTotalAmountOfPages(20, boosters.length),
            items: boosters.slice((Number(req.params.page) - 1) * 20, Number(req.params.page) * 20)
        });
    }

    private isValidArmor(armors: Array<string>, item: IKeyBoosterView): boolean {
        console.log(armors);
        for (const armor of armors) {
            // @ts-ignore
            if (item.armors[armor.toLowerCase()]) {
                return true;
            }
        }
    }

    private isValidClass(classes: Array<string>, item: IKeyBoosterView): boolean {
        for (const clazz of classes) {
            // @ts-ignore
            if (item.classes[clazz.toLowerCase()]) {
                return true;
            }
        }
    }

    private isValidName(search: string, name: string): boolean {
        return new RegExp(`^${search}`, 'i').test(name);
    }

    private async getKeyBoosters(client: Client): Promise<Array<IKeyBoosterView>> {
        const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
        const response: Array<IKeyBoosterView> = [];
        (await guild.roles.fetch(Configuration.get().RoleIds.LOW_KEY_BOOSTER)).members.forEach(item => {
            const data: IKeyBoosterView = {
                discordId: item.id,
                name: item.nickname ? item.nickname : item.displayName,
                armors: this.getUserArmors(item),
                classes: this.getUserClasses(item),
                roles: {
                    isLow: true,
                    isMid: item.roles.cache.get(Configuration.get().RoleIds.MEDIUM_KEY_BOOSTER) != null,
                    isHigh: item.roles.cache.get(Configuration.get().RoleIds.HIGH_KEY_BOOSTER) != null,
                    isEpic: item.roles.cache.get(Configuration.get().RoleIds.ELITE_KEY_BOOSTER) != null
                }
            };
            response.push(data);
        });

        return response;
    }

    private getUserClasses(user: GuildMember): {
        priest: boolean,
        warlock: boolean,
        mage: boolean,
        druid: boolean,
        monk: boolean,
        rogue: boolean,
        demonHunter: boolean,
        hunter: boolean,
        shaman: boolean,
        warrior: boolean,
        deathKnight: boolean,
        paladin: boolean
    } {
        return {
            priest: user.roles.cache.get(Configuration.get().ClassRoles.PRIEST.discordId) != null,
            warlock: user.roles.cache.get(Configuration.get().ClassRoles.WARLOCK.discordId) != null,
            mage: user.roles.cache.get(Configuration.get().ClassRoles.MAGE.discordId) != null,
            druid: user.roles.cache.get(Configuration.get().ClassRoles.DRUID.discordId) != null,
            monk: user.roles.cache.get(Configuration.get().ClassRoles.MONK.discordId) != null,
            rogue: user.roles.cache.get(Configuration.get().ClassRoles.ROGUE.discordId) != null,
            demonHunter: user.roles.cache.get(Configuration.get().ClassRoles.DEMON_HUNTER.discordId) != null,
            hunter: user.roles.cache.get(Configuration.get().ClassRoles.HUNTER.discordId) != null,
            shaman: user.roles.cache.get(Configuration.get().ClassRoles.SHAMAN.discordId) != null,
            warrior: user.roles.cache.get(Configuration.get().ClassRoles.WARRIOR.discordId) != null,
            deathKnight: user.roles.cache.get(Configuration.get().ClassRoles.DEATH_KNIGHT.discordId) != null,
            paladin: user.roles.cache.get(Configuration.get().ClassRoles.PALADIN.discordId) != null
        }
    }

    private getUserArmors(user: GuildMember): {
        cloth: boolean,
        leather: boolean,
        mail: boolean,
        plate: boolean
    } {
        return {
            cloth: user.roles.cache.get(Configuration.get().ArmorRoles.CLOTH.discordId) != null,
            leather: user.roles.cache.get(Configuration.get().ArmorRoles.LEATHER.discordId) != null,
            mail: user.roles.cache.get(Configuration.get().ArmorRoles.MAIL.discordId) != null,
            plate: user.roles.cache.get(Configuration.get().ArmorRoles.PLATE.discordId) != null
        }
    }
}
