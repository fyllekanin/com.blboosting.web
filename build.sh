#!/bin/bash

cd front-end
npm install
npm run build:prod

cd ..
cd back-end
cp -R ../front-end/dist/front-end/* src/public
npm install
npm run build

cd ..
