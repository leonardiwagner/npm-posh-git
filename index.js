#!/usr/bin/env node
//var os = require('os');

var program = require('commander');

var windowsInstaller = require("./windows")();
var linuxInstaller = require("./linuxInstaller");
var osxInstaller = require("./osx")();

var version = "0.0.1";

var logger = {
  log: function(message){
    console.log(message);
  }
};


var installer;
if (process.platform == "win32") {
  installer = windowsInstaller;
}else if (process.platform == "linux") {
  installer = new linuxInstaller(logger);
}else if (process.platform == "darwin") { // osx
  installer = osxInstaller;
} else {
  
}

logger.log("> Downloading content");
installer.donwload();
logger.log("> Install content");
installer.install();

program.version(version)
       .option('-n, --new', 'New installation')
       .parse(process.argv);


//console.log("\nCurrently in beta, please report some issue on github\n" + "https://github.com/leonardiwagner/npm-posh-git\n".blue.underline);

installer.install();



