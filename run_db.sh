#!/usr/bin/env bash

# create data directory if it does not exist
BASEDIR=$(dirname "$0")
mkdir -p $BASEDIR/data/

DB_PORT=27017
mongod --dbpath $BASEDIR/data/ --port ${DB_PORT}