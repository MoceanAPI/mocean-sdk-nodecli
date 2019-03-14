#!/usr/bin/env node
const pjson = require("./../package.json");
const program = require("commander");
const Config = require("./config");
const request = require("./request");

//Check version
program
    .version(pjson.version, "-V, --version")
    .option("-v, --verbose", "enables more rich output for certain commands");

//Set credential
program
    .command("setup <api_key> <api_secret>")
    .description("Setup API credential")
    .action((api_key, api_secret) => {
        Config.setCredential(api_key, api_secret, (err, res) => {
            if (err) {
                console.log(err);
                process.exit(1);
            } else {
                console.log("Setup success");
                process.exit(0);
            }

        });
    });


//Check balance
program
    .command('balance')
    .description("Check balance")
    .action(() => {
        request.getInstance().getBalance();
    });

//Check price list
program
    .command("pricing")
    .description("Check price")
    .action(() => {
        request.getInstance().getPriceList();
    });

//Send SMS
program
    .command("sms <from> <to> <text>")
    .description("Send sms")
    .action((from, to, text) => {
        request.getInstance().sendSMS(from, to, text);
    });

//Check SMS status
program
    .command("sms:status <message_id>")
    .description("Check message status")
    .action((message_id) => {
        request.getInstance().getSmsStatus(message_id);
    });

//Verify request
program
    .command("verify:request <brand> <recipient>")
    .description("Send verify code to user")
    .action((brand, recipient) => {
        request.getInstance().verifyRequest(brand, recipient);
    });

//Verify validate
program
    .command("verify:validate <request_id> <code>")
    .description("Validate the verify code")
    .action((request_id, code) => {
        request.getInstance().verifyValidate(request_id, code);
    });

program.on("option:verbose", () => {
    request.getInstance().enableVerbose();
});

program.on('command:*', () => {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
}).parse(process.argv);


//if not giving any command, display help
if (!process.argv.slice(2).length || program.args.length === 0) {
    program.outputHelp();
}

