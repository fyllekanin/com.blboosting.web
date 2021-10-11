#!/bin/bash

cd front-end
npm install
npm run build:prod
mv dist/front-end/* ../back-end/src/public/

cd ../back-end
npm install --only=production
npm run build

mv dist/* ~/web/production-temp/
mv node_modules ~/web/production-temp/
mv .env ~/web/production-temp/
mv ../integration/ecosystem.config.js ~/web/production-temp/

cd ~/web/production/
if test -f "ecosystem.config.js"; then
    pm2 stop ecosystem.config.js
fi

rm -Rf ./*
mv ./../production-temp/* ./
pm2 start ecosystem.config.js