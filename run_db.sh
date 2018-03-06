#!/usr/bin/env bash

DB_PORT=27017
mongod --dbpath data/ --port ${DB_PORT}