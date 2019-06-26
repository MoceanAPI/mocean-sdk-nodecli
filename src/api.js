const ora = require('ora');
const chalk = require('chalk');
const moceanService = require('./mocean_service');
const mapper = require('./mapper');
const formatter = require('./formatter');

const loader = ora('Please Wait...');

module.exports = {
    async login(api_key, api_secret, options) {
        loader.start();

        try {
            await moceanService.getClientWith(api_key, api_secret)
                .balance()
                .inquiry({
                    'mocean-medium': 'CLI'
                });
            const savedPath = moceanService.save({
                apiKey: api_key,
                apiSecret: api_secret
            }, options.local);

            loader.stop();
            console.log(`Credentials save to ${chalk.yellow(savedPath)}`);
        } catch (e) {
            loader.stop();
            console.error(chalk.red('Invalid credentials'));
        }
    },
    logout(options) {
        moceanService.delete(options.local);
        console.log(chalk.green('Successfully logged out'));
    },
    account() {
        try {
            const credentials = moceanService.read();
            console.log(`API Key    : ${credentials.apiKey}`);
            console.log(`API Secret : ${credentials.apiSecret}`);
        } catch (e) {
            console.error(e instanceof Error ? e.message : e);
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
        loader.start();

        try {
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
    async numberLookup(number) {
        loader.start();

        try {
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
