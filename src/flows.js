const {prompt} = require('enquirer');

module.exports = {
    async doLogin() {
        return await prompt([
            {
                type: 'input',
                name: 'apiKey',
                message: 'Api Key',
            },
            {
                type: 'password',
                name: 'apiSecret',
                message: 'Api Secret',
            }
        ]);
    },
    async confirmSms(to, text) {
        console.log(`To   : ${to}`);
        console.log(`Text : ${text.join(' ')}`);
        return await prompt({
            type: 'confirm',
            name: 'answer',
            initial: true,
            message: 'Confirm send sms?'
        });
    },
    async confirmNumberLookup(number) {
        console.log(`Number : ${number}`);
        return await prompt({
            type: 'confirm',
            name: 'answer',
            initial: true,
            message: `Confirm number lookup?`
        })
    }
};
