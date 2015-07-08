#!/usr/bin/env node
//var os = require('os');
var exec = require('child_process').exec;
var colors = require('colors');
var program = require('commander');

var windowsInstaller = require("./windows");
var unixInstaller = require("./unix");

var installer;
if (process.platform == "win32") {
  installer = windowsInstaller;
}else if (process.platform == "linux") {
  installer = unixInstaller;
}else if (process.platform == "darwin") { // osx
  installer = unixInstaller;
} else {
    //TODO: not found OS, in the future ask for user insert manually
}

program
  .version('0.0.1')
  .option('-n, --new', 'New installation')
  .parse(process.argv);

if (program.new){
  console.log("\nCurrently in beta, please report some issue on github\n" + "https://github.com/leonardiwagner/npm-posh-git\n".blue.underline);
}

console.log("> Downloading content");
var donwloadContentResult = installer.donwloadContent();
if(downloadContentResult.status === "OK"){
  console.log("> Downloading content [OK]");
}else{
  console.log("> Downloading content [ERROR]");
  console.log(downloadContentResult.errorMessage);
}

console.log("> Installing posh-git");
var installResult = installer.install();
if(installResult.status === "OK"){
  console.log("> Installing posh-git [OK]");
}else{
  console.log("> Installing posh-git [ERROR]");
  console.log(installResult.errorMessage);
}


//TODO: detect sudo and show only with actual sudo user, and
// hide sucess message if wasn`t real success
console.log("Done! Re-open your terminal to changes take effect!".green.bold);
if (program.new){
  console.log("\nDid you install this npm package with sudo?\n".yellow.bold + "So run ".yellow + "posh-git-install" + " to complete installation.\nOtherwise just ignore this warning.".yellow);
}


