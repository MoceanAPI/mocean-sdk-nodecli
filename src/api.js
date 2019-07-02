const ora = require('ora');
const chalk = require('chalk');
const moceanService = require('./mocean_service');
const mapper = require('./mapper');
const formatter = require('./formatter');
const flows = require('./flows');

const loader = ora('Please Wait...');

module.exports = {
    async login(api_key, api_secret, options) {
        try {
            let credentials;
            if (api_key && api_secret) {
                credentials = {
                    apiKey: api_key,
                    apiSecret: api_secret,
                };
            } else {
                credentials = await flows.doLogin();
            }

            loader.start();
            credentials.options = {};

            if (options.url) {
                credentials.options.baseUrl = options.url;
            }

            if (options.use) {
                credentials.options.version = options.use;
            }

            await moceanService.getClientWith(credentials.apiKey, credentials.apiSecret)
                .balance()
                .inquiry({
                    'mocean-medium': 'CLI'
                });
            const savedPath = moceanService.save(credentials, options.local);

            loader.stop();
            console.log(`Credentials save to ${chalk.yellow(savedPath)}`);
        } catch (e) {
            loader.stop();
            console.error(chalk.red('Invalid credentials'));
        }
    },
    logout(options) {
        try {
            moceanService.delete(options.local);
            console.log(chalk.green('Successfully logged out'));
        } catch (e) {
            console.error(`${chalk.red('Not logged in')}, please run ${chalk.grey('mocean login <api_key> <api_secret>')}`);
        }
    },
    account() {
        try {
            const credentials = moceanService.read();
            console.log(`API Key    : ${credentials.apiKey}`);
            console.log(`API Secret : ${credentials.apiSecret}`);
        } catch (e) {
            console.error(`${chalk.red('Not logged in')}, please run ${chalk.grey('mocean login <api_key> <api_secret>')}`);
        }
    },
    async balance() {
        loader.start();

        try {
            const res = await moceanService.getClient()
                .balance()
                .inquiry({
                    'mocean-medium': 'CLI'
                });
            res.status = chalk.green('OK');

            loader.stop();
            console.log(formatter(res));
        } catch (e) {
            loader.stop();
            console.error(e instanceof Error ? e.message : e);
        }
    },
    async pricing() {
        loader.start();

        try {
            const res = await moceanService.getClient()
                .pricing_list()
                .inquiry({
                    'mocean-medium': 'CLI'
                });

            loader.stop();
            console.log(formatter(res.destinations.map(destination => {
                destination.operator = decodeURIComponent(destination.operator.replace(/\+/g, ' '));
                return destination;
            })));
        } catch (e) {
            loader.stop();
            console.error(e instanceof Error ? e.message : e);
        }
    },
    async sms(to, text, options) {
        try {
            if (!options.confirm) {
                const confirmation = await flows.confirmSms(to, text);
                if (!confirmation.answer) {
                    console.log(chalk.yellow('Sms sending has been cancelled'));
                    return;
                }
            }

            loader.start();

            const res = await moceanService.getClient()
                .sms()
                .send({
                    'mocean-to': to,
                    'mocean-text': text.join(' '),
                    'mocean-from': options.from,
                    'mocean-medium': 'CLI'
                });

            loader.stop();
            console.log(formatter(res.messages.map(message => {
                message.status = message.status == 0 ? chalk.green('OK') : message.status;
                return message;
            })));
        } catch (e) {
            loader.stop();
            console.error(e instanceof Error ? e.message : e);
        }
    },
    async messageStatus(msg_id) {
        loader.start();

        try {
            const res = await moceanService.getClient()
                .message_status()
                .inquiry({
                    'mocean-msgid': msg_id,
                    'mocean-medium': 'CLI'
                });

            res.status = chalk.green('OK');
            res.message_status = mapper.mapMessageStatus(res.message_status);

            loader.stop();
            console.log(formatter(res));
        } catch (e) {
            loader.stop();
            console.error(e instanceof Error ? e.message : e);
        }
    },
    async numberLookup(number, options) {
        try {
            if (!options.confirm) {
                const confirmation = await flows.confirmNumberLookup(number);
                if (!confirmation.answer) {
                    console.log(chalk.yellow('Number lookup has been cancelled'));
                    return;
                }
            }

            loader.start();

            const res = await moceanService.getClient()
                .number_lookup()
                .inquiry({
                    'mocean-to': number,
                    'mocean-medium': 'CLI'
                });

            res.status = chalk.green('OK');
            const currentCarrier = res.current_carrier;
            const originalCarrier = res.original_carrier;

            delete res.current_carrier;
            delete res.original_carrier;

            loader.stop();
            console.log(formatter(res));
            console.log('Current Carrier:');
            console.log(formatter(currentCarrier));
            console.log('Original Carrier:');
            console.log(formatter(originalCarrier));
        } catch (e) {
            loader.stop();
            console.error(e instanceof Error ? e.message : e);
        }
    }
};
