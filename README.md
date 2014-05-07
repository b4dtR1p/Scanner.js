NodeScanner.js
==========

It's a simple port scanner made in NodeJs

npm library used
================
net, optimist, colors, http, request;

To install navigate in the scanner.js directory and from command line:
    npm install

and the package.jon install all dependencies automatically

Trubleshooting OSX
==================

If you recive this errore in your shell: '(libuv) Failed to create kqueue (24)', not problem!

What happens is that you run out of file descriptors; errno 24 is EMFILE.

The default upper limit on OS X is fairly low (256), try upping it, in your Terminal,  with 'ulimit -n 8192' or whatever is a reasonable limit for your application.

