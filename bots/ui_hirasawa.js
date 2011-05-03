var sys = require("sys"),
    irc = require("../ircclient");

var ui_hirasawa = {

    host:"localhost",
    port:6667,
    nick:"ui_hirasawa",
    userName:"ui_hirasawa",
    realName:"yaakaito@gmail.com",
    channels:["#憂"],
    client:null,
    menulist:[],
    mealTimes:[19]
};

ui_hirasawa.triggerHello = function( client, msg){

    if( msg.args.length > 1){
        if( msg.args[1].indexOf("う〜い〜") == 0 && (msg.args[1].match("アイス") || msg.args[1].match("あいす"))){
            client.channels[msg.args[0]].post( "メッ！");
        }
        if( msg.args[1] === "おはよう憂"){
            client.channels[msg.args[0]].post("おはようお姉ちゃん！");
        }
    }
};

ui_hirasawa.checkMealTimes = function(){
    setInterval(function(){
        var now = new Date();
        if( now.getHours() == 23 && now.getMinutes() == 54){
            ui_hirasawa.client.channels["#憂"].post("ご飯の時間だよ！");
        }
    }, 60000);
};

(function(){
    var client = new irc.Client(ui_hirasawa);
    client.connect();
    ui_hirasawa.client = client;
    ui_hirasawa.checkMealTimes();
})();