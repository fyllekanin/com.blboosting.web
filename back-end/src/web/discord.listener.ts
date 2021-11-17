import { Client, Guild, GuildMember, Role } from 'discord.js';
import { RoleRepository } from '../common/persistance/repositories/role.repository';
import { IRoleEntity } from '../common/persistance/entities/role.entity';
import { BoosterRepository } from '../common/persistance/repositories/booster.repository';
import { Configuration } from '../common/configuration';
import { IBooster } from '../common/persistance/entities/booster.entity';

enum Event {
    ROLE_CREATE = 'roleCreate',
    ROLE_DELETE = 'roleDelete',
    ROLE_UPDATE = 'roleUpdate',
    GUILD_MEMBER_REMOVE = 'guildMemberRemove',
    GUILD_MEMBER_UPDATE = 'guildMemberUpdate'
}

export class DiscordListener {
    private client: Client;
    private roleRepository = new RoleRepository();
    private boosterRepository = new BoosterRepository();

    async start(client: Client): Promise<void> {
        this.client = client;
        const guild = this.client.guilds.cache.get(process.env.DISCORD_GUILD_ID);

        await this.updateRoles(guild);
        await this.updateBoosters(guild);
        this.addBoosterListeners();
        this.addRoleListeners();
    }

    private async updateRoles(guild: Guild): Promise<void> {
        return new Promise(async res => {
            const existingRoles = await this.roleRepository.getAll();

            const promises: Array<Promise<IRoleEntity | void>> = [];
            existingRoles.forEach(role => {
                if (!guild.roles.cache.get(role.discordId)) {
                    promises.push(this.removeRole(role._id.toString()));
                }
            });
            (await guild.roles.fetch()).forEach(role => {
                if (existingRoles.every(item => item.discordId !== role.id)) {
                    promises.push(this.addRole(role));
                }
            });
            Promise.all(promises).then(() => res());
        });
    }

    private async updateBoosters(guild: Guild): Promise<void> {
        return new Promise(async res => {
            await this.boosterRepository.clear();
            const promises: Array<Promise<IBooster>> = [];
            (await guild.roles.fetch(Configuration.get().RoleIds.LOW_KEY_BOOSTER)).members.forEach(member => {
                const item: IBooster = this.getMember(member);
                promises.push(this.boosterRepository.insert(item));
            });
            Promise.all(promises).then(() => res());
        });
    }

    private addBoosterListeners(): void {
        this.client.addListener(Event.GUILD_MEMBER_REMOVE, this.onMemberLeft.bind(this));
        this.client.addListener(Event.GUILD_MEMBER_UPDATE, this.onMemberUpdate.bind(this));
    }

    private async onMemberLeft(member: GuildMember): Promise<void> {
        await this.boosterRepository.deleteBooster(member.id);
    }

    private async onMemberUpdate(_oldMember: GuildMember, newMember: GuildMember): Promise<void> {
        await this.boosterRepository.deleteBooster(newMember.id);
        if (!newMember.roles.cache.get(Configuration.get().RoleIds.LOW_KEY_BOOSTER)) {
            return;
        }
        await this.boosterRepository.insert(this.getMember(newMember));
    }

    private addRoleListeners(): void {
        this.client.addListener(Event.ROLE_CREATE, this.addRole.bind(this));
        this.client.addListener(Event.ROLE_DELETE, this.removeRole.bind(this));
        this.client.addListener(Event.ROLE_UPDATE, this.updateRole.bind(this));
    }

    private async updateRole(_oldRole: Role, newRole: Role): Promise<void> {
        await this.roleRepository.updateRole(newRole);
    }

    private async removeRole(discordId: string): Promise<void> {
        await this.roleRepository.deleteDiscordId(discordId);
    }

    private async addRole(role: Role): Promise<IRoleEntity> {
        return this.roleRepository.insert({
            discordId: role.id,
            name: role.name,
            position: role.position,
            permissions: {
                CAN_LOGIN: false,
                CAN_CREATE_BOOST: false,
                CAN_MANAGE_ROLES: false
            }
        });
    }

    private getMember(member: GuildMember): IBooster {
        return {
            name: member.nickname ? member.nickname : member.displayName,
            discordId: member.id,
            armors: {
                cloth: member.roles.cache.get(Configuration.get().ArmorRoles.CLOTH.discordId) != null,
                leather: member.roles.cache.get(Configuration.get().ArmorRoles.LEATHER.discordId) != null,
                mail: member.roles.cache.get(Configuration.get().ArmorRoles.MAIL.discordId) != null,
                plate: member.roles.cache.get(Configuration.get().ArmorRoles.PLATE.discordId) != null
            },
            classes: {
                priest: member.roles.cache.get(Configuration.get().ClassRoles.PRIEST.discordId) != null,
                warlock: member.roles.cache.get(Configuration.get().ClassRoles.WARLOCK.discordId) != null,
                mage: member.roles.cache.get(Configuration.get().ClassRoles.MAGE.discordId) != null,
                druid: member.roles.cache.get(Configuration.get().ClassRoles.DRUID.discordId) != null,
                monk: member.roles.cache.get(Configuration.get().ClassRoles.MONK.discordId) != null,
                rogue: member.roles.cache.get(Configuration.get().ClassRoles.ROGUE.discordId) != null,
                demonHunter: member.roles.cache.get(Configuration.get().ClassRoles.DEMON_HUNTER.discordId) != null,
                hunter: member.roles.cache.get(Configuration.get().ClassRoles.HUNTER.discordId) != null,
                shaman: member.roles.cache.get(Configuration.get().ClassRoles.SHAMAN.discordId) != null,
                warrior: member.roles.cache.get(Configuration.get().ClassRoles.WARRIOR.discordId) != null,
                deathKnight: member.roles.cache.get(Configuration.get().ClassRoles.DEATH_KNIGHT.discordId) != null,
                paladin: member.roles.cache.get(Configuration.get().ClassRoles.PALADIN.discordId) != null
            },
            boosterRoles: {
                isLow: true,
                isMedium: member.roles.cache.get(Configuration.get().RoleIds.MEDIUM_KEY_BOOSTER) != null,
                isHigh: member.roles.cache.get(Configuration.get().RoleIds.HIGH_KEY_BOOSTER) != null,
                isElite: member.roles.cache.get(Configuration.get().RoleIds.ELITE_KEY_BOOSTER) != null
            }
        };
    }
}