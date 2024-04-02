#!/bin/bash

cd /server
npm run start &

cd -  # Use "cd -" to return to the previous directory

cd /client
npm run start &

cd -