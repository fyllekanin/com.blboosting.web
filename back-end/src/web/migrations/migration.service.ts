import { MigrationTask } from './task.interface';
import { Task1633797391242 } from './tasks/task-1633797391242';
import { DatabaseService } from '../../common/database.service';
import { Collection } from 'mongodb';
import { Task1636648583114 } from './tasks/task-1636648583114';
import { Task1637170656132 } from './tasks/task-1637170656132';

interface IMigration {
    name: string;
    success: boolean;
}

export class MigrationService {
    static readonly COLLECTION = 'migrations';

    static async run(): Promise<void> {
        const collection = await DatabaseService.getCollection<IMigration>(MigrationService.COLLECTION);
        const performedMigrations = await this.getPerformedMigrations(collection);
        for (const task of this.getTasks()) {
            if (!performedMigrations.includes(task.getName())) {
                try {
                    await task.run();
                    collection.insertOne({ name: task.getName(), success: true });
                } catch (_e) {
                    collection.insertOne({ name: task.getName(), success: false });
                }
            }
        }
    }

    private static async getPerformedMigrations(collection: Collection<IMigration>): Promise<Array<string>> {
        const all = await collection.find().toArray();
        return all.map(task => task.name);
    }

    private static getTasks(): Array<MigrationTask> {
        return [
            new Task1633797391242(),
            new Task1636648583114(),
            new Task1637170656132()
        ];
    }
}
