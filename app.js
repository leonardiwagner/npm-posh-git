#!/usr/bin/env node
var program = require('commander');


var version = "0.0.1"

var installer
if (process.platform == "linux") {
  console.log("[OS IDENTIFIER] we've identified your OS as Linux.. hope that's right")
  installer = require("./linuxInstaller");
}

installer.install();

program.version(version)
       .option('-n, --new', 'New installation')
       .parse(process.argv);




