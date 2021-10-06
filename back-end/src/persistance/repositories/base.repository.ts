import { DeleteResult, Repository } from 'typeorm';
import { PaginationHelper } from '../../helpers/pagination.helper';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

interface PaginationOptions<T> {
    page: number;
    take: number;
    orderBy?: { sort: keyof T, order?: 'ASC' | 'DESC' };
    where?: FindConditions<T>[] | FindConditions<T> | ObjectLiteral | string;
}

interface IPaginationData<T> {
    total: number;
    page: number;
    items: Array<T>;
}

export interface PaginationWhere<T> {
    key: keyof T;
    value: string | number | boolean | Array<string | number | boolean>;
}

export abstract class BaseRepository<T> {

    async get(id: string): Promise<T> {
        return await this.getRepository().findOne(id);
    }

    async save(entity: T): Promise<T> {
        return await this.getRepository().save(entity);
    }

    async delete(entity: T): Promise<DeleteResult> {
        return await this.getRepository().delete(entity);
    }

    async getAll(): Promise<Array<T>> {
        return await this.getRepository().find();
    }

    async clear(): Promise<void> {
        await this.getRepository().clear();
    }

    async paginate(options: PaginationOptions<T>): Promise<IPaginationData<T>> {
        const result = await this.getRepository().find({
            take: options.take,
            skip: (options.take * options.page) - options.take,
            order: options.orderBy ? <any><unknown>{
                [options.orderBy.sort]: options.orderBy.order
            } : null
        });

        return {
            total: PaginationHelper.getTotalAmountOfPages(options.take, await this.getRepository().count()),
            page: options.page,
            items: result
        };
    }

    protected abstract getRepository(): Repository<T>;

}
