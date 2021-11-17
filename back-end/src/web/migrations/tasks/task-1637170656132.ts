import { MigrationTask } from '../task.interface';
import { DatabaseService } from '../../../common/database.service';
import { IRoleEntity } from '../../../common/persistance/entities/role.entity';
import { BoosterRepository } from '../../../common/persistance/repositories/booster.repository';

/**
 * - Create indexes for boosters
 */
export class Task1637170656132 implements MigrationTask {

    async run(): Promise<void> {
        await this.createBoosterIndexes();
    }

    getName(): string {
        return 'Task1637170656132';
    }

    private async createBoosterIndexes(): Promise<void> {
        const collection = DatabaseService.getCollection<IRoleEntity>(BoosterRepository.COLLECTION);
        await collection.createIndex({ name: 1 });
        await collection.createIndex({ discordId: 1 }, { unique: true });
        for (const armor of ['cloth', 'leather', 'mail', 'plate']) {
            await collection.createIndex({ [`armors.${armor}`]: 1 });
        }
        for (const clazz of ['mage', 'priest', 'warlock', 'demonHunter', 'druid', 'monk', 'rogue', 'hunter', 'shaman', 'paladin', 'warrior', 'deathKnight']) {
            await collection.createIndex({ [`classes.${clazz}`]: 1 });
        }
        for (const boosterRole of ['isLow', 'isMedium', 'isHigh', 'isElite']) {
            await collection.createIndex({ [`boosterRole.${boosterRole}`]: 1 });
        }
    }
}