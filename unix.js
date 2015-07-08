var poshFileDestination = "$HOME/posh-git.sh";
var profileFile = "$HOME/.bashrc";

function downloadFile(){
  var poshFileUrl = "https://raw.githubusercontent.com/lyze/posh-git-sh/master/git-prompt.sh";
  var shDownloadFile = 'curl "' + poshFileUrl + '" -o "' + poshFileDestination + '"';
  console.log(shDownloadFile);
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

module.exports.downloadContent = function(){

	return {
		status: "OK",
		errorMessage: ""
	}
};

module.exports.install = function(){

	return {
		status: "OK",
		errorMessage: ""
	}
};