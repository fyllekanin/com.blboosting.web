export = {
    useUnifiedTopology: true,
    type: 'mongodb',
    host: '127.0.0.1',
    port: 27017,
    database: 'bloodlust',
    synchronize: false,
    logging: false,
    name: 'default',
    entities: [
        'dist/persistance/entities/**/*.js'
    ],
    migrationsTableName: 'migrations',
    migrations: [
        'dist/database/migrations/**/*.js',
        'dist/database/seeds/**/*.js'
    ],
    subscribers: [
        'dist/persistance/subscribers/**/*.js'
    ],
    cli: {
        entitiesDir: 'dist/persistance/entities',
        migrationsDir: 'dist/database/migrations',
        subscribersDir: 'dist/persistance/subscriber'
    }
};
