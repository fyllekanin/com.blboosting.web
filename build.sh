#!/bin/bash

cd front-end
npm install
npm run build:prod

cd ..
cd back-end
cp -R ../front-end/dist/* src/public
npm install
npm run build

cd ..
