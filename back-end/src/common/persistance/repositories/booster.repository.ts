import { BaseRepository } from './base.repository';
import { Collection } from 'mongodb';
import { DatabaseService } from '../../database.service';
import { IBooster } from '../entities/booster.entity';

export class BoosterRepository extends BaseRepository<IBooster> {
    static readonly COLLECTION = 'boosters';
    protected repository: Collection<IBooster>;

    async deleteBooster(discordId: string): Promise<void> {
        await this.getCollection().deleteOne({ discordId: discordId });
    }

    static newRepository(): BoosterRepository {
        return new BoosterRepository();
    }

    protected getCollection(): Collection<IBooster> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = DatabaseService.getCollection(BoosterRepository.COLLECTION);
        return this.repository;
    }
}
