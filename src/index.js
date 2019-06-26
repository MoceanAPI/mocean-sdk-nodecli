const program = require('commander');
const ora = require('ora');
const packageInfo = require('../package');
const api = require('./api');

program
    .version(packageInfo.version, '-V, --version');

program
    .command('login <api_key> <api_secret>')
    .option('-l, --local', 'Save credentials to local directory')
    .description('Login using your api key and api secret')
    .action(api.login);

program
    .command('logout')
    .option('-l, --local', 'Logout from local directory')
    .description('Logout')
    .action(api.logout);

program
    .command('account')
    .alias('acc')
    .description('Show logged in account')
    .action(api.account);

program
    .command('account:balance')
    .alias('ab')
    .description('Check Account Balance')
    .action(api.balance);

program
    .command('account:pricing')
    .alias('ap')
    .description('Get Account Pricing')
    .action(api.pricing);

program
    .command('sms <to> <text...>')
    .option('-f, --from <from...>', 'From parameter', 'Mocean CLI')
    .description('Send a Sms')
    .action(api.sms);

program
    .command('sms:status <msg_id>')
    .alias('ss')
    .description('Check message status')
    .action(api.messageStatus);

program
    .command('number:lookup <number>')
    .alias('nl')
    .description('Perform Number Lookup')
    .action(api.numberLookup);

program.on('command:*', () => {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});

program.parse(process.argv);
