import { IUserEntity, UserEntity } from '../../entities/user/user.entity';
import { getConnection, Repository } from 'typeorm';
import { BaseRepository } from '../base.repository';

export class UserRepository extends BaseRepository<IUserEntity> {
    protected repository: Repository<UserEntity>;

    static newRepository(): UserRepository {
        return new UserRepository();
    }

    async getUserByDiscordId(discordId: string): Promise<IUserEntity> {
        return await this.getRepository()
            .findOne({ discordId: discordId });
    }

    protected getRepository(): Repository<UserEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(UserEntity);
        return this.repository;
    }
}
