# Dig8

## Installation

### If you don't have NPM Installed

If you are not using NVM to manage your NodeJS installation then first, remove any [previous version of Node](http://www.nearform.com/nodecrunch/nodejs-sudo-free/).

To install NVM 

* `curl https://raw.githubusercontent.com/creationix/nvm/v0.25.0/install.sh | bash`

To install Node (version is important!)

*`nvm install v0.12.7` 
*`nvm use v0.12.7` 

### If you don't have Ember tools installed 

* `npm install -g ember-cli`
* `npm install -g bower`
 

### Install dig

N.B. Whenever prompted to resolve conflicts always pick the 'canary' version

* `git clone <repository-url> <your-dig-directory>`
* change into your dig directory
* `git checkout fastboot`
* `npm cache clean && bower cache clean`
* `nvm use v0.12.7` 
* `npm install && bower install`
* change directory ./hacks
* `./setup_hacks`
* `ember install ArtisTechMedia/ember-cli-ccm-core.git#master


## Build

Building/running production mode is unstable as of this writing

* `ember fastboot:build`

## Running 

Running production mode is unstable as of this writing

* `ember fastboot --serve-assets --no-build`
* [http://localhost:3000](http://localhost:3000).




