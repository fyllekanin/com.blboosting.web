import { getConnection, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { IRoleEntity, RoleEntity } from '../entities/role.entity';

export class RoleRepository extends BaseRepository<IRoleEntity> {
    protected repository: Repository<RoleEntity>;

    async updateName(discordId: string, name: string): Promise<void> {
        await this.getRepository().update({ discordId: discordId }, { name: name });
    }

    async deleteDiscordId(discordId: string): Promise<void> {
        await this.getRepository().delete({ discordId: discordId });
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
