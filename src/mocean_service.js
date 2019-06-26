const moceansdk = require('mocean-sdk');
const fs = require('fs');
const ini = require('ini');

function localFile() {
    return `${process.cwd()}/.moceanrc`;
}

function globalFile() {
    const key = (process.platform == 'win32') ? 'USERPROFILE' : 'HOME';
    return `${process.env[key]}/.moceanrc`;
}

module.exports = {
    getClient() {
        const credentials = this.read();
        return new moceansdk.Mocean(
            new moceansdk.Client(credentials.apiKey, credentials.apiSecret)
        );
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
