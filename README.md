Mocean CLI
============================

This is the powerful CLI program for use with Mocean's API. To use this, you'll need a Mocean account. Sign up [for free at 
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

### Usage

After installation, login to the cli with your credentials

```bash
> mocean login <api_key> <api_secret>
```

This will save your credentials to `~/.moceanrc`.  
Add `--local` to save it in the directory which running the command

```bash
> mocean login <api_key> <api_secret> --local
```

Run `mocean logout` if you want to clear the credentials, this is strongly encouraged when running on untrusted device 

```bash
> mocean logout
```

To logout from the directory, add `--local`

```bash
> mocean logout --local
```

### Account

#### Account Info

```bash
> mocean account
```

Alias : `mocean acc`

#### Account Balance

```bash
> mocean account:balance
```

Alias : `mocean ab`

#### Account Pricing

```bash
> mocean account:pricing
```

Alias : `mocean ap`

### Sms

To use [Mocean's SMS API][doc_sms] to send an SMS message, use `mocean sms <to> <text>`.

```bash
> mocean sms <to> <text>
```

Default from will be `Mocean CLI`, you can override it by providing `--from` option

```bash
> mocean sms <to> <text> --from "Mocean"
```

Use `--confirm` to skip confirmation step

#### Sms Message Status

```bash
> mocean sms:status <msg_id>
```

Qlias : `mocean ss <msg_id>`

### Number Lookup

```bash
> mocean number:lookup <number>
```

Qlias : `mocean nl <number>`

### Options

```bash
> mocean -h

Usage: mocean [options] [command]

Options:
  -V, --version                           output the version number
  -h, --help                              output usage information

Commands:
  login [options] [api_key] [api_secret]  Login using your api key and api secret
  logout [options]                        Logout
  account|acc                             Show logged in account
  account:balance|ab                      Check Account Balance
  account:pricing|ap                      Get Account Pricing
  sms [options] <to> <text...>            Send a Sms
  sms:status|ss <msg_id>                  Check message status
  number:lookup|nl [options] <number>     Perform Number Lookup
```

License
-------

This library is released under the [MIT License][license]

[signup]: https://dashboard.moceanapi.com/register?medium=github&campaign=sdk-javascript
[doc_sms]: https://moceanapi.com/docs/?shell#send-sms
[license]: LICENSE
