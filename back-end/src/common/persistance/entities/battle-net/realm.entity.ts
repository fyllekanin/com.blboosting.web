import { CreatedUpdatedAtEntity } from '../created-updated-at.interface';
import { ObjectId } from 'mongodb';

export interface IRealmEntity extends CreatedUpdatedAtEntity {
    _id?: ObjectId;
    realmId: number;
    name: string;
    slug: string;
}
