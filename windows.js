var exec = require('child_process').exec;

var poshGitRepository = "https://github.com/dahlbyk/posh-git";

//todo: check if psget is installed

exec("git --version", function (error, stdout, stderr) {
    if (error) console.log("error"); // TODO
    else {
        //OK GIT is INSTALLED
    }
});

//downloadGitRepository();
executePoshGitInstall();

function downloadGitRepository() {
    exec("git clone " + poshGitRepository, function (error, stdout, stderr) {
        if (error) console.log("error"); // TODO
        else {
            //OK GIT is INSTALLED
            console.log(stdout);
        }
    });
}

function executePoshGitInstall() {
    // exec("Powershell.exe -executionpolicy remotesigned -File posh-git/install.ps1", function (error, stdout, stderr) {
    exec('powershell -Command "Get-ExecutionPolicy"' , function (error, stdout, stderr) {
        console.log("entro");
        if (error) console.log(error); // TODO
        else {
            stdout = stdout.trim().toLowerCase();
            if (stdout == "restricted") {
                //TODO: needs to    
            }
        }
    });
    console.log("saiu")
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