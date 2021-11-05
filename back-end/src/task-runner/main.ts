import { DatabaseService } from '../common/database.service';
import * as dotenv from 'dotenv';
import { WorkerEvents } from '../common/constants/worker-events.enum';
import { UpdateRaiderIoEvent } from './tasks/update-raider-io.event';
import { parentPort, workerData } from 'worker_threads';
import { ITask } from './task.interface';
import { UpdateWarcraftLogsEvent } from './tasks/update-warcraft-logs.event';

dotenv.config();

const EVENTS: { [key: string]: any } = {
    [WorkerEvents.CHECK_RAIDER_IO_FOR]: UpdateRaiderIoEvent,
    [WorkerEvents.CHECK_RAID_LOGS_FOR]: UpdateWarcraftLogsEvent
};

export class Main {

    async start(): Promise<void> {
        await this.preSetup();
        const event = EVENTS[workerData.type];
        const task: ITask = new event(workerData.data);
        await task.start();
    }

    private async preSetup(): Promise<void> {
        console.log('Create database connection');
        await DatabaseService.startup();
    }
}

(async () => {
    const main = new Main();
    await main.start();
    parentPort.postMessage(`${workerData.type} done`);
})();
