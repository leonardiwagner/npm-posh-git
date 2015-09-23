#!/usr/bin/env node
var Ople = module.exports = function() {
	var exec = require('child_process').exec;
	var spawn = require('child_process').spawn;
	var Promise = require('bluebird')
	var colors = require('colors')

	var that = this
	var userName
	var userDirectory
	var poshFileDestination
	var profileFile

	var execute = function(command){
		return new Promise(function(resolve, reject){
				console.log(command)
				exec(command, function(error, stdout, stderr) {
					if (error == null) resolve(stdout)
					else reject(error, stderr )
				})
		})
	}

	var executeBash = function(command){
		return new Promise(function(resolve, reject){
			console.log(command)
			var ls = spawn('source .bashrc')

			ls.stdout.on('data', function (data) {
				console.log('stdout: ' + data);
				resolve()
			});

			ls.stderr.on('data', function (data) {
				console.log('stderr: ' + data);
				resolve()
			});

			ls.on('close', function (code) {
				console.log('child process exited with code ' + code);
				resolve()
			});

		})
	}

	var getUserName = function() {
		return new Promise(function(resolve){
			console.log("[GET USER NAME] whats your name?")
			execute('whoami').then(function(currentUser){
				console.log("[GET USER NAME] hm.. " + currentUser + "?")
				if(currentUser == 'root'){
					console.log("[GET USER NAME] ROOT SERIOUSLY?!?! OMG! If you are using sudo to install global npm packages, STAHP DOING IT, IT'S BAD! We'll try to find your actual user name")
					execute('logname').then(function(actualUser) {
						console.log("[GET USER NAME] ohhh.. your real username is " + actualUser + ". How do I know that? MAGIC mein freund!")
						return resolve(actualUser.trim())
					}).catch(function(){
						console.log("[GET USER NAME] OMGOSH, we are installing it at root, I hope that's what you really want.. lets go")
						return resolve(currentUser.trim())
					})
				}else{
					console.log("[GET USER NAME] yeah! " + currentUser + " seems to be a nice user name, nice one!")
					return resolve(currentUser.trim())
				}
			})
		})
	}



	var downloadPoshGitFile = function()  {
		console.log("[DOWNLOAD] we're now downloading posh-git file, wait a sec")

		return new Promise(function(resolve, reject){
			var poshFileUrl = "https://raw.githubusercontent.com/lyze/posh-git-sh/master/git-prompt.sh"
			var shDownloadFile = 'wget -O ' + that.poshFileDestination + ' ' + poshFileUrl
			return execute(shDownloadFile).then(function(){
				resolve(that.poshFileDestination)
			}).catch(function(){
				console.log("[FATAL ERROR][DOWNLOAD POSH GIT FILE] we could not download and save posh git file, pls check:")
				console.log("- are you really connected on internet?")
				console.log("- can we access " + that.poshFileDestination + " to save posh-git file there?")
				reject()
			})
		})
	}

	var putPoshGitFileIntoBash = function()  {
		console.log("[INSTALL] ok, we'll put a reference of the downloaded file at your bash file")

		var breakLines = "'%s\\n%s\\n'"
		var sq = "'\\\''" //single quote
		var contentToWriteIntoProfile =  "'source " + that.poshFileDestination + "' " +
			" 'PROMPT_COMMAND='\\''__git_ps1 \"\\u@\\h:\\w\" \"\\\\\\$ \";'\\''$PROMPT_COMMAND'"

		var shWritePoshIntoProfile = "printf " + breakLines + " " + contentToWriteIntoProfile + " >> " + that.profileFile

		return new Promise(function(resolve, reject){
			execute(shWritePoshIntoProfile).then(function(){
				resolve()
			}).catch(function(){
				console.log("[FATAL ERROR][INSTALL POSH GIT INTO PROFILE] damn, we could not install :( , pls check:")
				console.log("- do we have access to write at: " + that.profileFile + "?")
				console.log("- is " + that.profileFile + " your real bash file? If not, pls add this line at bottom of your bash file:")
				console.log("\n " +  contentToWriteIntoProfile)
				console.log("\n can you make us a favor? pls report this error at:  , don't forget to tell us your OS and bash file location! tks")
				reject()
			})
		})
	}

	var reloadBash = function(){
		return new Promise(function(resolve){
			execute("source ~/.bashrc").then(function(){
				console.log("[FINISH] open a git folder, and be happy :)")
				resolve()
			}).catch(function(a, b){
				console.log("[OMG FATAL ER..JUST A JOKE IT'S ALL OK] reopen your terminal and access a git folder to see MAGIC")
			})
		})
	}

	var install = function(){
		console.log(that)
		getUserName().then(function(userNamex){
			that.userName = userNamex
			that.userDirectory = "~/" + that.userName
			that.poshFileDestination = "~/posh-git.sh"
			that.profileFile = "~/.bashrc"
			return downloadPoshGitFile()
		}).then(function(){
			return putPoshGitFileIntoBash()
		}).then(function(){
			return reloadBash()
		}).then(function(){

		})

	}

	return {
		install: install
	}
}()

