const fs = require("fs");
const ini = require("ini");
const emit = require("./Emitter");
const request = require("./Request");


class Config {
    static getCredential(callback = () => {
    }) {
        try {
            return ini.parse(fs.readFileSync(config_file(), "utf-8"));
        } catch (e) {
            console.error("Please run mocean setup <api_key> <api_secret>");
            process.exit(1);
        }
    }

    static setCredential(api_key, api_secret, callback = () => {
    }) {
        fs.writeFile(config_file(), ini.stringify({
            "credential": {
                "api_key": api_key,
                "api_secret": api_secret
            }
        }), {flag: "w"}, (err) => {
            if (err) {
                callback("Unable to create credential file at your home directory");
            } else {
                request.getInstance().getBalance((err, res) => {

                    if (!err) {
                        res = JSON.parse(res);
                        if (res.status == 0) {
                            callback("", "Setup success");
                        } else {
                            callback("Invalid credential");
                        }
                    } else {

                        callback(err, "");
                    }

                })
            }
        });
    }

    static removeConfigFile() {
        fs.unlink(config_file())
    }
}


let config_file = function () {

    var path = 'HOME';
    if (process.platform == 'win32') {
        path = 'USERPROFILE'
    }
    return `${process.env[path]}/.moceanrc`;
};

module.exports = Config;
