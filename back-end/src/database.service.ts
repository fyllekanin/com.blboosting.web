import { Collection, Db, MongoClient } from 'mongodb';

export class DatabaseService {
    private static connection: {
        client?: MongoClient;
        db?: Db;
    } = {};

    static async startup(): Promise<void> {
        this.connection.client = await new MongoClient(process.env.MONGODB_HOST).connect();
        this.connection.db = this.connection.client.db(process.env.MONGODB_DATABASE);
    }

    static getCollection<T>(collection: string): Collection<T> {
        return this.connection.db.collection(collection);
    }
}