/**
 * kaede IRC Client<Channel>
 *
 * Author    Kazuma Ukyo
 * License   MIT License
 *
 **/

var sys = require('sys');

Channel = exports.Channel = function( client, name){
  
    this.client = client;
    this.name   = name;
    this.joined = false;
};

Channel.prototype.join = function(){
    
    this.client.send( "JOIN " + this.name);
};

Channel.prototype.post = function( msg){
    
    this.client.send( "PRIVMSG " + this.name + " : " + msg);
};