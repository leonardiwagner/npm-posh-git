'use strict';

var exec = require('child_process').execSync;
var colors = require('colors');

var LinuxInstaller = function(logger){
	this.logger = logger;
};

function getUserName(){
	var currentUser = exec('whoami' , { encoding: 'utf8' }).trim();
	if(currentUser == 'root'){
		var actualUser = exec('logname', { encoding: 'utf8' }).trim();
		return actualUser.trim();
	}else{
		return currentUser.trim();
	}
}

var userDirectory = "~" + getUserName();
var poshFileDestination = userDirectory + "/posh-git.sh";
var profileFile = userDirectory + "/.bashrc";

LinuxInstaller.prototype = {
	donwload: function(){
		var poshFileUrl = "https://raw.githubusercontent.com/lyze/posh-git-sh/master/git-prompt.sh";
		var shDownloadFile = 'wget -O ' + poshFileDestination + ' ' + poshFileUrl;

		this.logger.log('Donwloading from: ' + poshFileUrl);
		this.logger.log('Will save at: ' + poshFileDestination);

		exec(shDownloadFile);
		return;
	},
	install: function(){
		var breakLines = "'%s\\n%s\\n'";
		var sq = "'\\\''"; //single quote
		var contentToWriteIntoProfile = breakLines + " 'source " + poshFileDestination + "' " +
			" 'PROMPT_COMMAND='\\''__git_ps1 \"\\u@\\h:\\w\" \"\\\\\\$ \";'\\''$PROMPT_COMMAND'";

		var shWritePoshIntoProfile = "printf " + contentToWriteIntoProfile + " >> " + profileFile;

		this.logger.log('Installing at: ' + poshFileDestination);

		exec(shWritePoshIntoProfile);
		return;
	}
};

module.exports = LinuxInstaller;
