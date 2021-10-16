import cron from 'node-cron';
import { IBackgroundTask } from './background-task.interface';
import { BattleNetRealmsTask } from './tasks/battle-net-realms.task';

export class BackgroundTaskHandler {
    private static readonly TASKS: Array<IBackgroundTask> = [
        new BattleNetRealmsTask()
    ];

    activate(): void {
        BackgroundTaskHandler.TASKS
            .filter(task => {
                if (!cron.validate(task.getSchedule())) {
                    console.error(`${task.constructor.name} does not have a valid schedule`);
                    return false;
                }
                return true;
            })
            .forEach(task => {
                task.run();
                cron.schedule(task.getSchedule(), task.run.bind(task));
            });
    }
}
