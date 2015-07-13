module.exports = function(){
  var poshGitRepository = "https://github.com/dahlbyk/posh-git";

  installViaPsGet(function installed(){
    //ok , installed
  }, function dontHavePsGetInstalled() {
    isExecutionPolicyGoodEnough(function yes(){
      installManually(function installed(){

      }, function error(){
        //error, can't install

      });
    }, function no(){
      isRunningAsAdministrator(function yes(){
        changePolicy(function ok(){

        }, function error(){
          //
        });
      }, function no(){
        //TODO: message run as administrator or installed PsGet
      })
    })
  })

  var installViaPsGet = function(trueCb, falseCb){  
    exec("Install-Module posh-git", function (error, stdout, stderr) {
      if (error) falseCb();
      else trueCb();
    });
  }

  function isGitInstalled(trueCb, falseCb){
    exec("git --version", function (error, stdout, stderr) {
      if (error) falseCb();
      else trueCb();
    });
  }

  function downloadGitRepository(trueCb, falseCb) {
      exec("git clone " + poshGitRepository, function (error, stdout, stderr) {
          if (error) falseCb();
          else trueCb(stdout);
      });
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

}