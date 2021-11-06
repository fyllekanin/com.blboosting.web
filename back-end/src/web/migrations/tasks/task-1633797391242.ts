import { MigrationTask } from '../task.interface';
import { DatabaseService } from '../../../common/database.service';
import { MigrationService } from '../migration.service';
import { UserRepository } from '../../../common/persistance/repositories/user/user.repository';
import { IUserEntity } from '../../../common/persistance/entities/user/user.entity';
import { IRoleEntity, RolePermission } from '../../../common/persistance/entities/role.entity';
import { RoleRepository } from '../../../common/persistance/repositories/role.repository';
import { CharacterRepository } from '../../../common/persistance/repositories/battle-net/character.repository';

/**
 * - Create indexes for migration collection
 * - Create indexes for users collection
 * - Create indexes for roles collection
 * - Create indexes for characters collection
 */
export class Task1633797391242 implements MigrationTask {

    async run(): Promise<void> {
        await this.createMigrationIndexes();
        await this.createUserIndexes();
        await this.createRoleIndexes();
        await this.createCharacterIndexes();
    }

    getName(): string {
        return 'Task1633797391242';
    }

    private async createMigrationIndexes(): Promise<void> {
        const collection = DatabaseService.getCollection<{ name: string }>(MigrationService.COLLECTION);
        await collection.createIndex({ name: 1 }, {
            unique: true
        });
    }

    private async createUserIndexes(): Promise<void> {
        const collection = DatabaseService.getCollection<IUserEntity>(UserRepository.COLLECTION);
        await collection.createIndex({ discordId: 1 }, {
            unique: true
        });
        await collection.createIndex({ battleNetId: 1 });
    }

    private async createRoleIndexes(): Promise<void> {
        const collection = DatabaseService.getCollection<IRoleEntity>(RoleRepository.COLLECTION);
        await collection.createIndex({ discordId: 1 }, {
            unique: true
        });
        await collection.createIndex({ position: 1 });
        for (const permission in RolePermission) {
            await collection.createIndex({ [`permissions.${permission}`]: 1 });
        }
    }

    private async createCharacterIndexes(): Promise<void> {
        const collection = DatabaseService.getCollection<IRoleEntity>(CharacterRepository.COLLECTION);
        await collection.createIndex({ characterId: 1 }, {
            unique: true
        });
        await collection.createIndex({ accountId: 1 });
        await collection.createIndex({ battleNetId: 1 });
        await collection.createIndex({ userId: 1 });
    }
}