var exec = require('child_process').exec;
var colors = require('colors');

var poshFileDestination = "~/posh-git.sh";
var profileFile = "~/.bashrc";

function downloadFile(){
  var poshFileUrl = "https://raw.githubusercontent.com/lyze/posh-git-sh/master/git-prompt.sh";
  var shDownloadFile = "wget -O " + poshFileDestination + " '" + poshFileUrl + "'";
  exec(shDownloadFile)
}

function install(){
  var breakLines = "'%s\\n%s\\n'";
  var sq = "'\\\''"; //single quote

  var contentToWriteIntoProfile = breakLines + " 'source " + poshFileDestination + "' " +
                                               " 'PROMPT_COMMAND='\\''__git_ps1 \"\\u@\\h:\\w\" \"\\\\\\$ \";'\\''$PROMPT_COMMAND'";

  var shWritePoshIntoProfile = "printf " + contentToWriteIntoProfile + " >> " + profileFile;

  exec(shWritePoshIntoProfile);
}

console.log("\nCurrently in beta, please report some issue on github\n" + "https://github.com/leonardiwagner/npm-posh-git\n".blue.underline);

downloadFile();
console.log("> Downloading posh-git file...");
install();
console.log("> Installing into '" + profileFile + "'...");
console.log("\nDone! Re-open your terminal to changes take effect!".green.bold);


