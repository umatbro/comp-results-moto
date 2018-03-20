const path = require('path');

const BASE_DIR = __dirname;

module.exports = {
    PROJECT_NAME: 'comp-results',
    BASE_DIR,
    CONFIG_DIR: path.join(BASE_DIR, 'config'),
};
