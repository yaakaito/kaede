var irc = require("../ircclient");

var echo_bot = {

    host:"chat.freenode.net",
    channels:["#yaakaito"],
    nick:"kaede_san"
};

echo_bot.eventPRIVMSG = function( client, msg){

    client.channels[msg.args[0]].post(msg.args[1]);
};

(function(){
    var client = new irc.Client(echo_bot);
    client.connect();
})();