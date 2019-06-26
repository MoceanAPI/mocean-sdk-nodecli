const chalk = require('chalk');

module.exports = {
    mapMessageStatus(code) {
        const data = {
            1: chalk.green("Transaction success"),
            2: chalk.red("Transaction failed"),
            3: chalk.red("Transaction failed due to message expired"),
            4: chalk.yellow("Transaction pending for final status"),
            5: chalk.red("Transaction not found")
        };

        return data[code];
    }
};
