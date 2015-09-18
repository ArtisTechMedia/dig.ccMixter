# Dig8

## Installation

Before installing you'll need to prep the box:
Remove any [http://www.nearform.com/nodecrunch/nodejs-sudo-free/](previous version of Node)

* Install NVM `curl https://raw.githubusercontent.com/creationix/nvm/v0.25.0/install.sh | bash`
* Use NVM to install Node `nvm install v0.12.7` This is the version of Node we rely on. v4 is out of the question.
* `npm install -g ember-cli`
* `npm install -g bower`
 

N.B. Whenever prompted to resolve conflicts always pick the 'canary' version

* `git clone <repository-url>` this repository
* change into the new directory
* `npm cache clean`
* `bower cache clean`
* `npm install`
* `bower install`
* change directory ./hacks
* `./setup_hacks`

## Running / Development

* `ember fastboot --server-assets`
* [http://localhost:3000](http://localhost:3000).


