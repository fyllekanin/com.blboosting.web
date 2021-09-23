import cron from 'node-cron';
import { IBackgroundTask } from './background-task.interface';

export class BackgroundTaskHandler {
    private static readonly TASKS: Array<IBackgroundTask> = [
    ];

    activate (): void {
        BackgroundTaskHandler.TASKS
            .filter(task => {
                if (!cron.validate(task.getSchedule())) {
                    console.log(`${task.constructor.name} does not have a valid schedule`);
                    return false;
                }
                return true;
            })
            .forEach(task => cron.schedule(task.getSchedule(), task.run.bind(task)));
    }
}
