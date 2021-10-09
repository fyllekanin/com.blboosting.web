import { Collection, DeleteResult, ObjectId, OptionalId } from 'mongodb';
import { PaginationHelper } from '../../helpers/pagination.helper';

interface PaginationOptions<T> {
    page: number;
    take: number;
    orderBy?: { sort: keyof T, order?: 'ASC' | 'DESC' };
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

export abstract class BaseRepository<T extends { _id?: ObjectId, createdAt?: number, updatedAt?: number }> {

    async get(id: ObjectId): Promise<T> {
        return await this.getCollection().findOne({ _id: id });
    }

    async insert(entity: T): Promise<T> {
        entity.createdAt = new Date().getTime();
        entity.updatedAt = new Date().getTime();

        const result = await this.getCollection().insertOne(entity as OptionalId<T>);

        entity._id = new ObjectId(result.insertedId);
        return entity;
    }

    async update(entity: T): Promise<T> {
        entity.updatedAt = new Date().getTime();

        await this.getCollection().updateOne({ _id: entity._id }, {
            $set: entity
        });
        return entity;
    }

    async delete(entity: OptionalId<T>): Promise<DeleteResult> {
        return await this.getCollection().deleteMany(entity);
    }

    async getAll(): Promise<Array<T>> {
        return await this.getCollection().find().toArray();
    }

    async clear(): Promise<void> {
        await this.getCollection().deleteMany({});
    }

    async paginate(options: PaginationOptions<T>): Promise<IPaginationData<T>> {
        const cursor = await this.getCollection().find<T>(null, {
            limit: options.take,
            skip: (options.take * options.page) - options.take,
            sort: options.orderBy ? <any><unknown>{
                [options.orderBy.sort]: options.orderBy.order
            } : null
        });

        return {
            total: PaginationHelper.getTotalAmountOfPages(options.take, await cursor.count()),
            page: options.page,
            items: await cursor.toArray()
        };
    }

    protected abstract getCollection(): Collection<T>;
}
