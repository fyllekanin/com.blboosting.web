import { IBackgroundTask } from '../background-task.interface';
import { BattleNetRegions, BattleNetService } from '../../apis/services/battle-net.service';
import { RealmRepository } from '../../persistance/repositories/battle-net/realm.repository';
import { IRealmEntity } from '../../persistance/entities/battle-net/realm.entity';
import { SlimBattleNetRealm } from '../../apis/interfaces/battle-net.interface';

export class BattleNetRealmsTask implements IBackgroundTask {
    getSchedule(): string {
        return '0 */24 * * *';
    }

    async run(): Promise<void> {
        const repository = new RealmRepository();
        const realms = await BattleNetService.getRealmList(BattleNetRegions.EU);

        const existingRealms = await repository.getAll();
        const newRealms: Array<IRealmEntity> = [];
        for (const realm of realms.realms) {
            const existingItem = existingRealms.find(item => item.realmId === realm.id);
            if (!existingItem) {
                newRealms.push(await this.getNewRealmEntity(realm));
            }
        }
        if (newRealms.length > 0) {
            await repository.insertMany(newRealms).then(() => console.log('Realm task done'));
        } else {
            console.log('Realm task done');
        }
    }

    private async getNewRealmEntity(slimRealm: SlimBattleNetRealm): Promise<IRealmEntity> {
        const realm = await BattleNetService.getRealm(BattleNetRegions.EU, slimRealm.slug);

        return {
            realmId: slimRealm.id,
            slug: slimRealm.slug,
            name: slimRealm.name,
            isTournament: realm.isTournament,
            timezone: realm.timezone,
            category: realm.category
        };
    }
}