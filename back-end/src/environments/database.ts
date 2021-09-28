export = {
  useUnifiedTopology: true,
  type: "mongodb",
  host: process.env.MONGODB_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.MONGODB_DATABASE,
  synchronize: false,
  logging: false,
  name: "default",
  entities: ["dist/persistance/entities/**/*.js"],
  migrationsTableName: "migrations",
  migrations: [
    "dist/database/migrations/**/*.js",
    "dist/database/seeds/**/*.js",
  ],
  subscribers: ["dist/persistance/subscribers/**/*.js"],
  cli: {
    entitiesDir: "dist/persistance/entities",
    migrationsDir: "dist/database/migrations",
    subscribersDir: "dist/persistance/subscriber",
  },
};
