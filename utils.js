const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const ArgumentParser = require('argparse').ArgumentParser;
const fetch = require('node-fetch');

const Track = require('./models/track');
const Contestant = require('./models/contestant');

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

commandDescription =
`This command will store 100 random users in your database using https://randomuser.me/ API.

Example usage:
./load_users.js 100 --db=ds261078.mlab.com:61078/comp-results-test -u <dbuser> -p <dbpassword>`;

const parser = new ArgumentParser({
  addHelp: true,
  description: commandDescription,
});

function loadRandomUsers(dbURI, numOfUsers=100) {
    mongoose.connect(dbURI);
    fetch('https://randomuser.me/api/?results=' + numOfUsers)
        .then((res) => res.json())
        .then((response) => Promise.all(
            response.results.map((user) => {
                let name = user.name;
                return Contestant.create({
                    name: name.first.capitalize() +' '+ name.last.capitalize(),
                });
            })
        ))
        .then((res) => console.log('Number of records:', res.length))
        .catch((err) => console.log(err))
        .then(() => mongoose.connection.close());
}

/**
 * Create request and response mocks using ``node-mocks-http`` library
 *
 * @param {Object} responseOptions
 * @param {Object} requestOptions
 * @return {*[]} response and request mocks
 */
function httpResReqMocks(responseOptions={}, requestOptions={}) {
    return [
        httpMocks.createResponse(responseOptions),
        httpMocks.createRequest(requestOptions),
    ];
}

module.exports = {
    httpMocks: httpResReqMocks,
    generateRandomUsers: loadRandomUsers,
};

if (!module.parent) {
  let args = parser.parseArgs();
  console.log(args);
}
