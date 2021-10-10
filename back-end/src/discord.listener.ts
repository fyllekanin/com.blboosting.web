import { Client, Guild, Role } from 'discord.js';
import { RoleRepository } from './persistance/repositories/role.repository';
import { IRoleEntity } from './persistance/entities/role.entity';

enum Event {
    ROLE_CREATE = 'roleCreate',
    ROLE_DELETE = 'roleDelete',
    ROLE_UPDATE = 'roleUpdate'
}

export class DiscordListener {
    private client: Client;
    private repository = new RoleRepository();

    async start(client: Client): Promise<void> {
        this.client = client;
        const guild = this.client.guilds.cache.get(process.env.DISCORD_GUILD_ID);

        await this.updateRoles(guild);
        this.addRoleListeners();
    }

    private async updateRoles(guild: Guild): Promise<void> {
        return new Promise(async (res) => {
            const existingRoles = await this.repository.getAll();

            const promises: Array<Promise<IRoleEntity | void>> = [];
            existingRoles.forEach(role => {
                if (!guild.roles.cache.get(role.discordId)) {
                    promises.push(this.removeRole(role._id.toString()));
                }
            });
            guild.roles.cache.forEach(role => {
                if (existingRoles.every(item => item.discordId !== role.id)) {
                    promises.push(this.addRole(role));
                }
            });
            Promise.all(promises).then(() => res());
        });
    }

    private addRoleListeners(): void {
        this.client.addListener(Event.ROLE_CREATE, this.addRole.bind(this));
        this.client.addListener(Event.ROLE_DELETE, this.removeRole.bind(this));
        this.client.addListener(Event.ROLE_UPDATE, this.updateRole.bind(this));
    }

    private async updateRole(_oldRole: Role, newRole: Role): Promise<void> {
        await this.repository.updateRole(newRole);
    }

    private async removeRole(discordId: string): Promise<void> {
        await this.repository.deleteDiscordId(discordId);
    }

    private async addRole(role: Role): Promise<IRoleEntity> {
        return this.repository.insert({
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
}