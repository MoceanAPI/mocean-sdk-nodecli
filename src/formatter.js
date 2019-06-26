const clitable = require("cli-table2");
const chalk = require('chalk');

module.exports = function (res) {
    let header = [];
    let value = [];

    if (Array.isArray(res)) {
        for (let i = 0; i < res.length; i++) {
            let row = [];
            for (let key in res[i]) {
                if (res[i].hasOwnProperty(key)) {
                    if (i === 0) {
                        header.push(chalk.cyan.bold(key));
                    }
                    row.push(res[i][key]);
                }
            }

            value.push(row);
        }
    } else {
        for (let key in res) {
            if (res.hasOwnProperty(key)) {
                header.push(chalk.cyan.bold(key));
                value.push(res[key]);
            }
        }
        value = [value];
    }

    let table = new clitable({head: header});
    for (let i = 0; i < value.length; i++) {
        table.push(value[i]);
    }

    return table.toString();
};
