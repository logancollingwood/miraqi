const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');
const passportSocketIo = require("passport.socketio");

function InitializePassportWeb(app, dbInstance, sessionStore, cookieParser) {
    const scopes = ['identify', 'email', 'guilds'];
        
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    let hostName = process.env.HOST_NAME
    console.log(`using hostName: ${hostName}`);

    passport.use(new DiscordStrategy({
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: hostName + 'login/discord/return',
        proxy: true,
        scope: scopes
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            console.log(profile);
            dbInstance.createUser(profile, 'discord')
            .then(user=> {
                return done(null, user);
            });
        });
    }));

    app.use(cookieParser())
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            httpOnly: false
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    function checkAuth(req, res, next) {
        if (req.isAuthenticated()) return next();
        res.send('not logged in :(');
    }

    app.get('/login/discord', passport.authenticate('discord'));

    app.get('/login/discord/return', passport.authenticate('discord', {failureRedirect: '/login'}),
        function(req, res) {
            res.redirect('/home');
        }
    );

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('http://localhost:3001/');
    });
    app.get('/user/info', checkAuth, function(req, res) {
        res.json(req.user);
    });
}

function InitializePassportSocket(io, sessionStore, cookieParser) {
    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        secret:       'keyboard cat',    // the session_secret to parse the cookie
        key:          'connect.sid',
        store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
        success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
        fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below
    }));
}

function onAuthorizeSuccess(data, accept) {
  // The accept-callback still allows us to decide whether to
  // accept the connection or not.
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept){
  if(error)
    throw new Error(message);
  console.log('FAILED CONNECTION TO SOCKET.IO: ' + message);

  // We use this callback to log all of our failed connections.
  accept(null, false);
}

module.exports = {
    WebAuth: InitializePassportWeb,
    SocketAuth: InitializePassportSocket
};