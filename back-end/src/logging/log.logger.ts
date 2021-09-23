import { InternalRequest } from '../utilities/internal.request';
import { Log } from './log.interface';
import { LogBuilder, LogEntity } from '../persistance/entities/log/log.entity';
import { LogRepository } from '../persistance/repositories/log.repository';

export class Logger {

    static async createLog(req: InternalRequest, log: Log): Promise<void> {
        const entity = Logger.getEntity(LogEntity.newBuilder(), log, req);
        const logRepository = new LogRepository(entity);

        await logRepository.save(entity);
    }

    private static getEntity<T>(builder: LogBuilder, log: Log, req: InternalRequest): LogEntity {
        return builder
            .withUserId(log.userId)
            .withLogId(log.id)
            .withContentId(log.contentId)
            .withBeforeChange(log.beforeChange)
            .withAfterChange(log.afterChange)
            .withIp(req.ip)
            .build();
    }
}

