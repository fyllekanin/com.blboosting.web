import { getConnection, Repository } from 'typeorm';
import { LogEntity } from '../entities/log/log.entity';
import { BaseRepository } from './base.repository';

export class LogRepository extends BaseRepository <LogEntity> {
    private readonly entity: LogEntity;
    protected repository: Repository<LogEntity>;

    constructor(entity: LogEntity) {
        super();
        this.entity = entity;
    }

    protected getRepository(): Repository<LogEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(LogEntity);
        return this.repository;
    }
}
