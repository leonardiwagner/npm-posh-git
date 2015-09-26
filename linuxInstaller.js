#!/usr/bin/env node
module.exports = function() {
	var exec = require('child_process').exec;
	var spawn = require('child_process').spawn;
	var Promise = require('bluebird')
	var logger = require('./logger')

	var that = this
	var userName
	var userDirectory
	var poshFileDestination
	var profileFile

	var execute = function(command){
		return new Promise(function(resolve, reject){
				//console.log(command)
				exec(command, function(error, stdout, stderr) {
					if (error == null) resolve(stdout)
					else reject(error, stderr )
				})
		})
	}

	var getUserName = function() {
		return new Promise(function(resolve){
			logger.info("user", "checking your user name")
			execute('whoami').then(function(currentUser){
				currentUser = currentUser.trim()
				logger.info("user", "hm.. " + currentUser + "?")
				if(currentUser == 'root'){
					logger.info("user", "omg, root? I'll check if you are using sudo. It's not recommended to install npm global package with sudo.")
					execute('logname').then(function(actualUser) {
						actualUser = actualUser.trim()
						logger.info("user", "oww.. your real username is " + actualUser + ", so I'll install posh-git there.")
						return resolve(actualUser)
					}).catch(function(){
						logger.info("user", "ok, root so. I hipo that's what you really want.. lets go")
						return resolve(currentUser)
					})
				}else{
					logger.info("user", "hello " + currentUser + ", nice username.")
					return resolve(currentUser)
				}
			})
		})
	}

	var downloadPoshGitFile = function()  {
		logger.info("donwload", "downloading posh-git file, wait a sec")

		return new Promise(function(resolve, reject){
			var poshFileUrl = "https://raw.githubusercontent.com/lyze/posh-git-sh/master/git-prompt.sh"
			var shDownloadFile = 'wget -O ' + that.poshFileDestination + ' ' + poshFileUrl
			return execute(shDownloadFile).then(function(){
				logger.info("donwload", "downloaded and saved at: " + that.poshFileDestination)
				resolve(that.poshFileDestination)
			}).catch(function(){
				logger.error("donwload", "could not download and save posh git file, pls check your internet connection and if I can access: " + that.poshFileDestination)
				reject()
			})
		})
	}

	var putPoshGitFileIntoBash = function()  {
		logger.info("install", "placing posh-git file into your configuration file: " + that.profileFile)

		var breakLines = "'%s\\n%s\\n'"
		var sq = "'\\\''" //single quote
		var contentToWriteIntoProfile =  "'source " + that.poshFileDestination + "' " +
			" 'PROMPT_COMMAND='\\''__git_ps1 \"\\u@\\h:\\w\" \"\\\\\\$ \";'\\''$PROMPT_COMMAND'"

		var shWritePoshIntoProfile = "printf " + breakLines + " " + contentToWriteIntoProfile + " >> " + that.profileFile

		return new Promise(function(resolve, reject){
			execute(shWritePoshIntoProfile).then(function(){
				logger.info("install", "done")
				resolve()
			}).catch(function(){
				logger.error("install", "could not write at your configuration file. Please check if I can write at: "  + that.profileFile + ". If it isn't the right configuration file, please add these lines at yours: \n" +  contentToWriteIntoProfile)
				reject()
			})
		})
	}

	var reloadBash = function(){
		return new Promise(function(resolve){
			execute(". ~/.profile").then(function(){
				logger.info("reload", "ok, configuration file reloaded")
				resolve()
			}).catch(function(a, b){
				logger.info("reload", "please reopen your terminal to see posh-git")
			})
		})
	}

	var install = function(){
		getUserName().then(function(userNameResult){
			that.userName = userNameResult
			that.userDirectory = "~/" + that.userName
			that.poshFileDestination = "~/posh-git.sh"
			that.profileFile = "~/.profile"
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

