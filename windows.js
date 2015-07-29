var exec = require('child_process').exec;

module.exports = function(){
  var poshGitRepository = "https://github.com/dahlbyk/posh-git";

  function log(text){
    console.log(">> " + text);
  }

  var install = function(){
    log("trying to install via PsGet...")
    installViaPsGet(function success(){
      log("yes! posh-git was installed sucefully via PsGet");
    }, function failInstallingWithPsGet(error) {
      log("no! psget can't install posh-git, probably it wasn't installed, so we'll attemp to install manually...");
      log("now, we're checking if git is installed...")
      isGitInstalled(function yes(){
        log("okay, git is installed, now we're going to download posh-git installation...");
        downloadGitRepository(function ok(){
          log("yeah, installation donwloaded, now we're installing...");
          executePoshGitInstallerManually(function installed(){
             log("DONE! posh-git installed!");
          }, function error(errorMsg){
            log("ERROR: can't install posh-git -> " + errorMsg);
          });

        }, function error(errorMsg){
          log("ERROR: can't download posh-git installation -> " + errorMsg + " -> please report this issue")
        });
      }, function no(){
        log("ERROR: can't install posh-git -> You need to install git before installing posh-git!!")
      })
    });

  };

//TODO: I've tested with PsGet installed, works on command line, but fails via this exec
var installViaPsGet = function(trueCb, falseCb){  
  exec("Install-Module posh-git", function (error, stdout, stderr) {
    if (error) falseCb(error);
    else trueCb();
  });
};

function isGitInstalled(trueCb, falseCb){
  exec("git --version", function (error, stdout, stderr) {
    if (error) falseCb();
    else trueCb();
  });
};

function downloadGitRepository(trueCb, falseCb) {
    exec("git clone " + poshGitRepository, function (error, stdout, stderr) {
        if (error) falseCb(error);
        else trueCb(stdout);
    });
};

var executePoshGitInstallerManually = function(trueCb, falseCb){
    log("installing posh-git manually")
    exec(".\\posh-git\\install.ps1", function (error, stdout, stderr) {
        if (error) falseCb(error);
        else trueCb(stdout);
    });
};

/*
function installManually(){
  log("checking if exec policy is good to install posh-git")
    isExecutionPolicyGoodEnough(function yes(){
      log("yes! exec policy is good to install posh-git")
      
    }, function no(){
      log("no! exec policy is not good to install posh-git")
      log("checking if it's exec as administrator to change exec policy")

      isRunningAsAdministrator(function yes(){
        log("yes! running as administrator, will try to change exec policy")

        changePolicy(function ok(){
          log("yes! exec policy changed!")

        }, function error(){
          log("error! can't change exec policy!")

        });
      }, function no(){
        log("error! it's not running as administrator!")
        
      })
}


  

  


  function isExecutionPolicyGoodEnough(trueCb, falseCb) {
    exec('powershell -Command "Get-ExecutionPolicy"' , function (error, stdout, stderr) {
        if (error) console.log(error); // TODO, wtf!!
        else {
            stdout = stdout.trim().toLowerCase();
            if (stdout == "restricted") {
              console.log(stdout);
              trueCb();
            }
        }
    });
}

  function isRunningAsAdministrator(callback) {
    var checkScript = "$user = [Security.Principal.WindowsIdentity]::GetCurrent();    (New-Object Security.Principal.WindowsPrincipal $user).IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)";
    exec('powershell -Command "' + checkScript + '"', function (error, stdout, stderr) {
        console.log("entro");
        if (error) console.log(error); // TODO
        else {
            stdout = stdout.trim().toLowerCase();
            if (stdout == "true") {
                callback(true);
            } else {
                callback(false);
            }
        }
    });
  }
  */

  return {
    install: install
  }

}