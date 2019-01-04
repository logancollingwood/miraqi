var passport = require('passport');
var DiscordStrategy = require('passport-discord').Strategy;
var session = require('express-session');
var passportSocketIo = require("passport.socketio");
function InitializePassportWeb(app, dbInstance, sessionStore, cookieParser) {
    var scopes = ['identify', 'email', 'guilds'];
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });
    var hostName = process.env.HOST_NAME;
    console.log("using hostName: " + hostName);
    passport.use(new DiscordStrategy({
        callbackURL: hostName + 'login/discord/return',
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        proxy: true,
        scope: scopes
    }, function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            console.log(profile);
            dbInstance.createUser(profile, 'discord')
                .then(function (user) {
                return done(null, user);
            });
        });
    }));
    app.use(cookieParser());
    app.use(session({
        cookie: {
            httpOnly: false
        },
        resave: false,
        secret: 'keyboard cat',
        saveUninitialized: false,
        store: sessionStore,
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    function checkAuth(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.send({ loggedIn: false });
    }
    app.get('/login/discord', passport.authenticate('discord'));
    app.get('/login/discord/return', passport.authenticate('discord', { failureRedirect: '/login' }), function (req, res) {
        res.redirect('/home');
    });
    app.get('/auth/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
    app.get('/user/info', checkAuth, function (req, res) {
        console.log('user requested info');
        console.log(req.user);
        res.json({ loggedIn: true, user: req.user });
    });
}
function InitializePassportSocket(io, sessionStore, cookieParser) {
    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        secret: 'keyboard cat',
        key: 'connect.sid',
        store: sessionStore,
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail,
    }));
}
function onAuthorizeSuccess(data, accept) {
    // The accept-callback still allows us to decide whether to
    // accept the connection or not.
    accept(null, true);
}
function onAuthorizeFail(data, message, error, accept) {
    if (error) {
        throw new Error(message);
    }
    console.log('FAILED CONNECTION TO SOCKET.IO: ' + message);
    // We use this callback to log all of our failed connections.
    accept(null, false);
}
module.exports = {
    WebAuth: InitializePassportWeb,
    SocketAuth: InitializePassportSocket
};
//# sourceMappingURL=MerakiAuth.js.map