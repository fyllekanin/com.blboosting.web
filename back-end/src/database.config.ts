import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';

export class DatabaseConfig {

    static getConfig(): MongoConnectionOptions {
        return {
            useUnifiedTopology: true,
            type: 'mongodb',
            host: process.env.MONGODB_HOST,
            port: Number(process.env.MONGODB_PORT),
            database: process.env.MONGODB_DATABASE,
            synchronize: false,
            logging: false,
            name: 'default',
            entities: ['dist/persistance/entities/**/*.js'],
            migrationsTableName: 'migrations',
            migrations: [
                'dist/database/migrations/**/*.js',
                'dist/database/seeds/**/*.js'
            ],
            subscribers: ['dist/persistance/subscribers/**/*.js'],
            cli: {
                entitiesDir: 'dist/persistance/entities',
                migrationsDir: 'dist/database/migrations',
                subscribersDir: 'dist/persistance/subscriber'
            }
        };
    }
}