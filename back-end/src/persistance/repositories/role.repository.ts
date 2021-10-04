import { getConnection, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { IRoleEntity, RoleEntity, RolePermissions } from '../entities/role.entity';
import { Role } from 'discord.js';

const SUPER_ADMINS: Array<string> = process.env.DISCORD_SUPER_ADMIN.split(',');

export class RoleRepository extends BaseRepository<IRoleEntity> {
    protected repository: Repository<RoleEntity>;

    async updateRole(role: Role): Promise<void> {
        await this.getRepository().update({discordId: role.id}, {
            name: role.name,
            position: role.position
        });
    }

    async deleteDiscordId(discordId: string): Promise<void> {
        await this.getRepository().delete({discordId: discordId});
    }

    async getPermissions(userId: string, roleIds: Array<string>): Promise<RolePermissions> {
        const permissions = RolePermissions.newBuilder().build();
        const keys = Object.keys(permissions);
        if (SUPER_ADMINS.includes(userId)) {
            for (const key of keys) {
                // @ts-ignore
                permissions[key] = true;
            }
            return permissions;
        }

        const roles = await this.getRepository().find({where: {discordId: {$in: roleIds}}});
        for (const key of keys) {
            // @ts-ignore
            permissions[key] = roles.some(role => role.permissions[key]);
        }

        return permissions;
    }

    static newRepository(): RoleRepository {
        return new RoleRepository();
    }

    protected getRepository(): Repository<RoleEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(RoleEntity);
        return this.repository;
    }
}
