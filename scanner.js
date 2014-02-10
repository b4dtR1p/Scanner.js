#!/usr/bin/env node
//NodeScanner - v0.1
var colors = require('colors');
console.log('NodeScanner - v0.1 - Open Port List:\n'.blue);
var http = require('http');
var net = require('net');
var request = require('request');

// get host from user command input && print menu
function host() {
    var argv = require('optimist')
        .usage('Usage:$ scanner.js -h [host]'.magenta)
        .demand(['h'])
        .argv;
    return(argv.h);
};
// host to scan
var host =  host();

// request over Tor proxy
request.get({
    uri: host,
    proxy: 'http://localhost:9050'
}, function (err, resp, body) {
    if (err || resp.statusCode != 200) {
        console.log(('oops! something failed').red);
    }
    else {
        console.log(body)
    }
});
// http headers request
var option = {method: 'HEAD', host: host, port: 80, path: '/', agent: false};
var req = http.request(option, function(res) {
    console.log('Http headers:\n'.red);
    console.log(JSON.stringify(res.headers).green);
});
req.end();
// starting from port number
var start = 1;
// to port number
var end = 1024;
// sockets should timeout asap to ensure no resources are wasted
// but too low a timeout value increases the likelyhood of missing open sockets, so be careful
var timeout = 2000;

// the port scanning loop 
while (start <= end) {
    
    // it is always good to give meaningful names to your variables
    // since the context is changing, we use `port` to refer to current port to scan 
    var port = start;
    
    // we create an anonynous function, pass the current port, and operate on it
    // the reason we encapsulate the socket creation process is because we want to preseve the value of `port` for the callbacks 
    (function(port) {
        //console.log('CHECK: ' + port);
        var s = new net.Socket();
        
        s.setTimeout(timeout, function() { s.destroy(); });
        s.connect(port, host, function() {
            console.log(('OPEN: ' + port).magenta);
            // we don't destroy the socket cos we want to listen to data event
            // the socket will self-destruct in 2 secs cos of the timeout we set, so no worries
        });
        
        // if any data is written to the client on connection, show it
        s.on('data', function(data) {
            console.log((port +': '+ data).magenta);
            s.destroy();
        });
        
        s.on('error', function(e) {
            // silently catch all errors - assume the port is closed
            s.destroy();
        });
    })(port);
    
    start++;
}
