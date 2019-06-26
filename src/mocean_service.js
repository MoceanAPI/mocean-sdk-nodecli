const moceansdk = require('mocean-sdk');
const fs = require('fs');
const ini = require('ini');
const chalk = require('chalk');

function localFile() {
    return `${process.cwd()}/.moceanrc`;
}

function globalFile() {
    const key = (process.platform == 'win32') ? 'USERPROFILE' : 'HOME';
    return `${process.env[key]}/.moceanrc`;
}

module.exports = {
    getClient() {
        try {
            const credentials = this.read();
            return new moceansdk.Mocean(
                new moceansdk.Client(credentials.apiKey, credentials.apiSecret)
            );
        } catch (e) {
            throw new Error(`${chalk.red('Not logged in')}, please run ${chalk.grey('mocean login <api_key> <api_secret>')}`);
        }
    },
    getClientWith(apiKey, apiSecret) {
        return new moceansdk.Mocean(
            new moceansdk.Client(apiKey, apiSecret)
        );
    },
    save(credential, local = false) {
        const path = local ? localFile() : globalFile();
        fs.writeFileSync(path, ini.stringify(credential));

        return path;
    },
    read() {
        const credentials = fs.readFileSync(
            fs.existsSync(localFile()) ? localFile() : globalFile(),
            'utf-8'
        );

        return ini.parse(credentials);
    },
    delete(local = false) {
        const path = local ? localFile() : globalFile();
        fs.unlinkSync(path);
    }
};
