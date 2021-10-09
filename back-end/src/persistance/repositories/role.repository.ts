import { BaseRepository } from './base.repository';
import { IRoleEntity, IRolePermissions, RolePermission } from '../entities/role.entity';
import { Role } from 'discord.js';
import { Collection } from 'mongodb';
import { DatabaseService } from '../../database.service';

export class RoleRepository extends BaseRepository<IRoleEntity> {
    static readonly COLLECTION = 'roles';
    protected repository: Collection<IRoleEntity>;

    async updateRole(role: Role): Promise<void> {
        await this.getCollection().updateOne({ discordId: role.id }, {
            $set: {
                name: role.name,
                position: role.position
            }
        });
    }

    async deleteDiscordId(discordId: string): Promise<void> {
        await this.getCollection().deleteOne({ discordId: discordId });
    }

    async getImmunity(roleIds: Array<string>): Promise<number> {
        const result = await this.getCollection().findOne({
            order: { position: 'DESC' },
            where: {
                discordId: { $in: roleIds }
            }
        })
        return result.position;
    }

    async doUserHavePermission(discordId: string, permissions: Array<RolePermission>, roleIds: Array<string>): Promise<boolean> {
        /**if (process.env.DISCORD_SUPER_ADMIN.split(',').includes(discordId)) {
            return true;
        }*/

        const permissionObj = permissions.reduce((prev, curr) => {
            // @ts-ignore
            prev[curr] = true;
            return prev;
        }, {})
        return await this.getCollection().countDocuments({
            discordId: { $in: roleIds },
            permissions: permissionObj
        }) > 0;
    }

    async getPermissions(discordId: string, roleIds: Array<string>): Promise<IRolePermissions> {
        const permissions: IRolePermissions = {};
        const keys = Object.keys(RolePermission);
        /**if (process.env.DISCORD_SUPER_ADMIN.split(',').includes(discordId)) {
            for (const key of keys) {
                // @ts-ignore
                permissions[key] = true;
            }
            return permissions;
        }*/

        const roles = await this.getCollection().find({ discordId: { $in: roleIds } }).toArray();
        for (const key of keys) {
            // @ts-ignore
            permissions[key] = roles.some(role => role.permissions[key]);
        }

        return permissions;
    }

    static newRepository(): RoleRepository {
        return new RoleRepository();
    }

    protected getCollection(): Collection<IRoleEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = DatabaseService.getCollection(RoleRepository.COLLECTION);
        return this.repository;
    }
}
