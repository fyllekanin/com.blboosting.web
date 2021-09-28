#!/bin/bash

pm2 kill
rm -Rf ~/demo/*
cp ./integration/* ~/demo/
cp ./back-end/dist/* ~/demo/

cd ~/demo
pm2 start ecosystem.config.js
