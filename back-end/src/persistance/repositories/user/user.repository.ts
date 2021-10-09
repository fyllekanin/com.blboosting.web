import { IUserEntity } from '../../entities/user/user.entity';
import { BaseRepository } from '../base.repository';
import { Collection } from 'mongodb';
import { DatabaseService } from '../../../database,service';

export class UserRepository extends BaseRepository<IUserEntity> {
    static readonly COLLECTION = 'users';
    protected repository: Collection<IUserEntity>;

    static newRepository(): UserRepository {
        return new UserRepository();
    }

    async getUserByDiscordId(discordId: string): Promise<IUserEntity> {
        return await this.getCollection()
            .findOne({discordId: discordId});
    }

    protected getCollection(): Collection<IUserEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = DatabaseService.getCollection(UserRepository.COLLECTION);
        return this.repository;
    }
}
