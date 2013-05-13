
/**
 * Module dependencies.
 */

var SITE_SECRET = 'flibberdijibbet'

var express = require('express')
  , routes = require('./routes')
  , login = require('./routes/login')
  , echo = require('./routes/echo')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , socketio = require('socket.io')
  , connect = require('connect')
  , cookie = require('cookie')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  ;

passport.use(new LocalStrategy(function(username, password, done) {
    // TODO check against database instead
    if (username != "monkey") {
        done(null, false, { message: 'Incorrect username.' });
    }
    if (password != "ookook") {
        done(null, false, { message: 'Incorrect password.' });
    }
    user = "Magic Monkey";
    return done(null, user);
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    done(null, user);
});

var app = express();
var sessionStore = new connect.session.MemoryStore();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser(SITE_SECRET));
app.use(express.session({
    key: 'express.sid'
  , store: sessionStore
}));
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/echo', echo.echo);
app.get('/users', user.list);

app.get('/login', login.login);
app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login',
                                                    failureFlash: false })
);


var server = http.createServer(app);
var io = socketio.listen(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// authorization here - arbitrary for the moment
// io.configure(function() {
    // used to have the authorization setting inside this block.
    // seems that it doesn't need to be.
// });

io.set('authorization', function(data, errorAndAccept) {
    console.log('Checking handshake data:');
    console.log(data);
    
    if (!data.headers.cookie) {
        console.log('no cookie :(');
        return errorAndAccept('No cookie? No connection!', false);
    }
    
    console.log('I haz a cookie on my head!');
    
    // Note: this is a hack using a private API, apparently
    //       there is a cookie parser in Connect but it assumes it will be working
    //       with request.
    // the example gist I'm copying from does it like this though, so for now it is like this.
    // https://gist.github.com/bobbydavid/2640463
    // this fails anyway, it doesn't find module 'cookie'
    // data.cookie = require('cookie').parseCookie(data.headers.cookie);
    // data.cookie = require('cookie').parseSignedCookies(data.cookie, SITE_SECRET);
    
    data.signedCookie = cookie.parse(data.headers.cookie);
    data.cookie = connect.utils.parseSignedCookies(data.signedCookie, SITE_SECRET);
    data.sessionID = data.cookie['express.sid'];

    // TODO look up the session from the cookie to make sure it is valid
    // (would maybe also want to tack on some info about permissions etc.)
    
    sessionStore.get(data.sessionID, function(error, session) {
        if (error) {
            return errorAndAccept('Error while looking up session', false);
        } else if (!session) {
            console.log('Handshake data for mismatched session');
            console.log(data);
            return errorAndAccept('Session not found', false);
        }
        
        console.log('user: ' + session.passport.user);
        
        data.session = session;
        data.foo = 'bar';
        console.log('Handshake data after cookie parsing');
        console.log(data);
        errorAndAccept(null, true);
    });    
});

io.sockets.on('connection', function(socket) {
    console.log('Socket connection made');
    
    // illustrative, this could actually be used to check permissions
    // for an operation or something
    console.log('Handshake data foo: ' + socket.handshake.foo)

    socket.emit('echo', { echo: 'Hi ' + socket.handshake.session.passport.user });

    socket.on('sometext', function(data) {
        console.log(data);
        socket.emit('echo', { echo: data.message.toUpperCase() });
    });
});