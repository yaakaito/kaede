/**
 * kaede IRC Client
 *
 * Author    Kazuma Ukyo
 * License   MIT License
 *
 **/

var sys = require("sys"),
    net = require("net"),
    fs  = require("fs"),
    chn = require("./channel");

var Client = exports.Client =  function( conf){
    this.initialize( conf);
};

Client.prototype.initialize = function( conf){
    
    this.host     = conf.host || "localhost";
    this.port     = conf.port || 6667;
    this.nick     = conf.nick || "kaede";
    this.userName = conf.userName || "kaede";
    this.realName = conf.realName || "kaede";
    this.encoding = conf.encoding || "utf8";
    this.startupChannels = conf.channels || [];
    this.startupJoined = false;
    this.channels = {};
    this.timeout = 60*60*72;
    this.debug = true;
    this.connection = null;

    this.triggers = [conf.triggerHello];
    this.events = {};
    
};

Client.prototype.connect = function(){
    
    var con = this.connection = net.createConnection( this.port, this.host);
    con.setEncoding( this.encoding);
    con.setTimeout( this.timeout);

    this.addEventListener( "connect", function(){
        if(this.debug){
            sys.puts("connected!");
        }
        
        this.send( "NICK " + this.nick);
        this.send( "USER " + this.userName + " 0 * : " + this.realName);        
    });
    
    this.addEventListener( "data", function( chunk){
        if(this.debug){
            sys.puts(chunk);
        }
        for( var i = 0, lines = chunk.split("\r\n"), len = lines.length; i < len; i++){
            var msg = Client.parse(lines[i]);
            if(this.debug){
                sys.puts( msg);
            }
            this.executeMessage( msg);
        }

        if( !this.startupJoined){
            for( var j = 0, len = this.startupChannels.length; j < len; j++){
                var name = this.startupChannels[j], ch = new Channel(this, name);
                ch.join();
                this.channels[name] = ch;
            }
            this.startupJoined = true;
        } 
    });

    this.addEventListener( "close", function(){
        this.disconnect( "close");
    });
    this.addEventListener( "eof", function(){
        this.disconnect( "EOF");
    });
    this.addEventListener( "timeout", function(){
        this.disconnect( "timeout");
    });
};

Client.prototype.disconnect = function( msg){

    if( this.connection.readyState !== "closed"){
        this.connection.close();
        sys.puts("disconnected (" + msg +")");
    }
};

Client.prototype.executeMessage = function( msg){
  
    switch( msg.command){
    case "PING":
        this.send( "PONG :" +  msg.args[0]);
    case "PRIVMSG":
        this.triggers[0]( this, msg);
    }
};

Client.prototype.send = function( msg){

    if( this.connection.readyState !== "open")
        this.disconnect( "not open");

    if( this.debug)
        sys.puts(">" + msg);

    this.connection.write( msg+"\r\n", this.encoding);
};

Client.prototype.addEventListener = function( evt, func){

    var self = this;
    return this.connection.addListener( evt, (function(){
        return function(){
            func.apply( self, arguments);
        };
    })());
};

Client.parse = function(chunk){
    
    var tmp = chunk.split( " "), prefix=null, command=null, args=[];
    for( var i = 0, len = tmp.length; i < len; i++){
        if( tmp[i] === ""){
            continue;
        } else if( prefix === null && i == 0 && tmp[i].indexOf( ":") == 0){
            prefix = tmp[i].substr( 1);
        } else if( command === null && tmp[i].indexOf( ":") != 0){
            command = tmp[i].toUpperCase();
        } else if( tmp[i].indexOf( ":") == 0){
            args.push( tmp.slice(i).join( " ").substr(1));
            break;
        } else {
            args.push(tmp[i]);
        }
    }
    return {
        prefix : prefix,
        command : command,
        args : args,
        toString : function(){
            return "**prefix\t: " + this.prefix + "\n**command\t: " + this.command + "\n**args\t\t: " + this.args;
        }
    }
};