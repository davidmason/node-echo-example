# Echo: node.js practice

## License
MIT (see LICENSE)

## Use

### Prerequisites
node.js installed

### Installation
npm install

### Deployment
node app.js


## Purpose

This module exists purely for my own exploration of node.js functionality and modules. I'm using a
moderately simple echo server as a basis around which to look at how to get a set of features
working with express, socket.io, passport and whatever else I find (these look good for now, but I
might swap them out for other modules at any time).


## Goals

I will likely work on this module until it can do the following:

 - redirect any unauthenticated user to a sign-in page
    - OR decorate unrestricted pages with a sign-in widget
 - authenticate a user with openid or similar
 - allow a user to send 2 different types of message, one requiring higher privileges
 - restrict a user's privileges based on some state on the server
    (initially: number of messages the user has echoed)
 - update privileges in the middle of a socket connection based on activity
    (i.e. when they have passed a threshold with number of messages echoed)
 - maybe work with redis (pending learning more about redis)

I haven't seen a complete working example of express + passport + socket.io, so I may clean
this up when I'm done and present it as a working example of that combination.

