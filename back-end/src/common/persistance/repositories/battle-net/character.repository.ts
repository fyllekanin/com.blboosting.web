import { BaseRepository } from '../base.repository';
import { Collection, ObjectId } from 'mongodb';
import { DatabaseService } from '../../../database.service';
import { ICharacter } from '../../entities/battle-net/character.entity';

export class CharacterRepository extends BaseRepository<ICharacter> {
    static readonly COLLECTION = 'characters';
    protected repository: Collection<ICharacter>;

    static newRepository(): CharacterRepository {
        return new CharacterRepository();
    }

    async getCharacterForUserId(userId: string | ObjectId): Promise<Array<ICharacter>> {
        return await this.getCollection().find({ userId: new ObjectId(userId) }).toArray();
    }

    async removeCharactersForUserId(userId: string | ObjectId): Promise<void> {
        await this.getCollection().deleteMany({ userId: new ObjectId(userId) });
    }

    protected getCollection(): Collection<ICharacter> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = DatabaseService.getCollection(CharacterRepository.COLLECTION);
        return this.repository;
    }
}
