import 'reflect-metadata';
import { ConnectionOptions, createConnection } from 'typeorm';
import { Server } from '@overnightjs/core';
import { PageController } from './rest-services/page.controller';
import { BackgroundTaskHandler } from './background-tasks/background-task.handler';
import { INITIAL_MIDDLEWARE } from './rest-services/middlewares/initial.middleware';
import * as express from 'express';
import compression from 'compression';
import Database from './environments/database';
import * as dotenv from 'dotenv';

dotenv.config();

class MainServer extends Server {
    private backgroundTaskHandler: BackgroundTaskHandler;

    constructor() {
        super();
        this.backgroundTaskHandler = new BackgroundTaskHandler();
        this.app.use(express.json());
        this.app.use(compression());
        this.app.use('/', express.static(__dirname + '/public'));
        this.app.use('/resources', express.static(__dirname + '/resources'));
    }

    start(port: number): void {
        createConnection(Database as ConnectionOptions).then(() => {
            this.setupControllers();
            this.backgroundTaskHandler.activate();
            this.app.get('/*', (req, res) => {
                res.sendFile(__dirname + '/public/index.html');
            });
            this.app.listen(port, () => {
                console.log(`Server started on port ${port}`);
            });
        });
    }

    private setupControllers(): void {
        super.addControllers(
            [
                new PageController()
            ],
            null,
            INITIAL_MIDDLEWARE
        );
    }
}

const server = new MainServer();
server.start(3000);
