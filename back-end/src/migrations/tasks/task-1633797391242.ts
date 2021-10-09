import { MigrationTask } from '../task.interface';
import { DatabaseService } from '../../database.service';
import { MigrationService } from '../migration.service';
import { UserRepository } from '../../persistance/repositories/user/user.repository';
import { IUserEntity } from '../../persistance/entities/user/user.entity';
import { IRoleEntity, RolePermission } from '../../persistance/entities/role.entity';
import { RoleRepository } from '../../persistance/repositories/role.repository';

/**
 * - Create indexes for migration collection
 * - Create indexes for users collection
 * - Create indexes for roles collection
 */
export class Task1633797391242 implements MigrationTask {

    async run(): Promise<void> {
        await this.createMigrationIndexes();
        await this.createUserIndexes();
        await this.createRoleIndexes();
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
}