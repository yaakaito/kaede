var sys = require("sys"),
    irc = require("../ircclient");

var ui_hirasawa = {

    host:"localhost",
    port:6667,
    nick:"ui_hirasawa",
    userName:"ui_hirasawa",
    realName:"yaakaito@gmail.com",
    channels:["#憂"],
};

ui_hirasawa.triggerHello = function( client, msg){

    if( msg.args[1] === "おはよう憂"){
        client.channels[msg.args[0]].post("おはようお姉ちゃん！");
    }
};

var client = new irc.Client(ui_hirasawa);
client.connect();