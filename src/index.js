const program = require('commander');
const packageInfo = require('../package');
const api = require('./api');

program
    .version(`Mocean CLI v${packageInfo.version}`, '-V, --version');

program
    .command('login [api_key] [api_secret]')
    .option('-l, --local', 'Save credentials to local directory')
    .option('-u, --url <url>', 'Specify the rest url, default to https://rest.moceanapi.com')
    .option('-v, --use <use>', 'Specify the rest version')
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
    .option('-c, --confirm', 'skip confirmation step')
    .description('Send a Sms')
    .action(api.sms);

program
    .command('sms:status <msg_id>')
    .alias('ss')
    .description('Check message status')
    .action(api.messageStatus);

program
    .command('number:lookup <number>')
    .option('-c, --confirm', 'skip confirmation step')
    .alias('nl')
    .description('Perform Number Lookup')
    .action(api.numberLookup);

program.on('command:*', () => {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});

program.parse(process.argv);

if (!program.args.length) {
    program.help();
}
