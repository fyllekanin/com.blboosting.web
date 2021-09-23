import { UserEntity } from '../../entities/user/user.entity';
import { getConnection, Repository } from 'typeorm';
import { BaseRepository } from '../base.repository';

export class UserRepository extends BaseRepository<UserEntity> {
    protected repository: Repository<UserEntity>;

    protected getRepository(): Repository<UserEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(UserEntity);
        return this.repository;
    }
}
