const MongoDBMemoryServer = require('mongodb-memory-server');

(async () => {
    const mongod = await MongoDBMemoryServer.MongoMemoryServer.create({
        instance: {
            port: 43333
        }
    });

    console.log(`MondoDB is running on: ${mongod.getUri()}`);
})();