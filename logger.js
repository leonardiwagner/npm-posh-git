var colors = require('colors');

module.exports = function(){
  return {
    info: function(area, message){
      console.log(("[" + area + "] ").green  + message)
    },
    error: function(area, message){
      console.log(("[" + area + "] ").red  + message)
    }
  }
}()