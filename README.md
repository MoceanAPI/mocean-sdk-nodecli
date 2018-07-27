MoceanAPI Client Library for Node CLI 
============================

This is the Node CLI client library for use Mocean's API. To use this, you'll need a Mocean account. Sign up [for free at 
moceanapi.com][signup].

 * [Installation](#installation)
 * [Example](#example)
 * [Options](#options) 
 
## Installation

### Pre-requisite
Mocean-CLI is powered by NodeJS, so you will need first to install [NodeJS](https://nodejs.org/en/) and [npm](https://www.npmjs.com/
), before proceed to use Mocean-CLI.

### Install mocean-cli 

To use the client library you'll need to have [created a Mocean account][signup]. 

To install the Node CLI client library using [npm](https://www.npmjs.com/).

```bash
npm i mocean-cli -g
```

### First time setup

Setup your mocean-cli with your API key and secret:

```shell
mocean setup <api_key> <api_secret>
```

## Example

To use [Mocean's SMS API][doc_sms] to send an SMS message, use `mocean sms <from> <to> <text>`.

```javascript
mocean sms Mocean 60123456789 "Hello World"
```

## Options

```shell
mocean -h

Usage: app [options] [command]

Options:

-V, --version                        output the version number
-v, --verbose                        enables more rich output for certain commands
-h, --help                           output usage information

Commands:

setup <api_key> <api_secret>         Setup API credential
balance                              Check balance
price [options]                      Check price
sms <from> <to> <text>               Send sms
sms:status <message_id>              Check message status
verify:request <brand> <recipient>   Send verify code to user
verify:validate <request_id> <code>  Validate the verify code
```

License
-------

This library is released under the [MIT License][license]

[signup]: https://dashboard.moceanapi.com/register?medium=github&campaign=sdk-javascript
[doc_sms]: https://docs.moceanapi.com/?javascript#send-sms
[doc_inbound]: https://docs.moceanapi.com/?javascript#receive-sms
[doc_verify]: https://docs.moceanapi.com/?javascript#overview-3
[license]: LICENSE.txt