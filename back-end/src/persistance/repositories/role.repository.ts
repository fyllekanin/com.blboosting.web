import { getConnection, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { IRoleEntity, RoleEntity, RolePermission, RolePermissions } from '../entities/role.entity';
import { Role } from 'discord.js';

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

    async getImmunity(discordId: string, roleIds: Array<string>): Promise<number> {
        const result = await this.getRepository().findOne({order: {position: 'DESC'}})
        return result.position;
    }

    async doUserHavePermission(discordId: string, permissions: Array<RolePermission>, roleIds: Array<string>): Promise<boolean> {
        if (process.env.DISCORD_SUPER_ADMIN.split(',').includes(discordId)) {
            return true;
        }
        const roles = await this.getRepository().find({
            where: {
                discordId: {$in: roleIds}
            }
        });
        return permissions.every(permission => roles.some(role => role.permissions[permission]));
    }

    async getPermissions(discordId: string, roleIds: Array<string>): Promise<RolePermissions> {
        const permissions = RolePermissions.newBuilder().build();
        const keys = Object.keys(permissions);
        if (process.env.DISCORD_SUPER_ADMIN.split(',').includes(discordId)) {
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
