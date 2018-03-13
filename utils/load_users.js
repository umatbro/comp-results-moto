const ArgumentParser = require('argparse').ArgumentParser;

commandDescription =
`This command will store 100 random users in your database using https://randomuser.me/ API.

Example usage:
./load_users.js 100 --db=ds261078.mlab.com:61078/comp-results-test -u <dbuser> -p <dbpassword>`

const parser = new ArgumentParser({
  addHelp: true,
  description: commandDescription;
});

function getRandomUsers(...args) {

}


module.exports = getRandomUsers;

if (!module.parent) {
  let args = parser.parseArgs();
  console.log(args);
}
