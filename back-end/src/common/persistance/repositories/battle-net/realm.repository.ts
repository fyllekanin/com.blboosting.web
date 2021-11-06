import { BaseRepository } from '../base.repository';
import { Collection } from 'mongodb';
import { DatabaseService } from '../../../database.service';
import { IRealmEntity } from '../../entities/battle-net/realm.entity';

export class RealmRepository extends BaseRepository<IRealmEntity> {
    static readonly COLLECTION = 'realms';
    protected repository: Collection<IRealmEntity>;

    static newRepository(): RealmRepository {
        return new RealmRepository();
    }

    async doRealmWithIdExist(id: number): Promise<boolean> {
        return await this.getCollection().countDocuments({ realmId: id }) > 0;
    }

    protected getCollection(): Collection<IRealmEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = DatabaseService.getCollection(RealmRepository.COLLECTION);
        return this.repository;
    }
}
