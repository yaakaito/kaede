var irc = require("../irc");

var echo_bot = {

    host:"chat.freenode.net",
    port:6667,
    nick:"kaede_san",
    userName:"kaede_san",
    realName:"yaakaito@gmail.com",
    channels:["#yaakaito"],
    encoding:"utf8",
    debug:true
};

echo_bot.eventPRIVMSG = function( client, msg){

    client.channels[msg.args[0]].post(msg.args[1]);
};

echo_bot.eventJOIN = function( client, msg){

    client.channels[msg.args[0]].post("Hi, " + msg.prefix.split("!")[0]);
};

(function(){
    var client = new irc.Client(echo_bot);
    client.connect();
})();