import { MigrationTask } from '../task.interface';
import { DatabaseService } from '../../../common/database.service';
import { IRoleEntity } from '../../../common/persistance/entities/role.entity';
import { RoleRepository } from '../../../common/persistance/repositories/role.repository';

/**
 * - Create index for role name
 */
export class Task1633797391242 implements MigrationTask {

    async run(): Promise<void> {
        await this.createRoleNameIndex();
    }

    getName(): string {
        return 'Task1633797391242';
    }

    private async createRoleNameIndex(): Promise<void> {
        const collection = DatabaseService.getCollection<IRoleEntity>(RoleRepository.COLLECTION);
        await collection.createIndex({ name: 1 });
    }
}