
var poshFileUrl = "https://raw.githubusercontent.com/lyze/posh-git-sh/master/git-prompt.sh"
var poshFileDestination = "~/.posh-git-file.sh";

var profileFile = "~/.profile";

var poshGitInstallCommand = 'PROMPT_COMMAND=\'__git_ps1 "\u@\h:\w" "\\\$ ";\'$PROMPT_COMMAND';


var shDownloadFile = "wget -O " + poshFileDestination + " '" + poshFileUrl + "'";
var shWritePoshIntoProfile = "printf '%s\n    %s\n' 'Host localhost' 'ForwardAgent yes' >> " + profileFile
