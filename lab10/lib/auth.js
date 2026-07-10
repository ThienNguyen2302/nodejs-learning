const User = require('../models/user.js')
const passport = require('passport' )
const FacebookStrategy = require('passport-facebook').Strategy;

passport. serializeUser (function(user, done){
    done(null, user._id);
})

passport. deserializeUser(function(id, done) {
    User . findById(id, function(err, user){
        if(err || !user) return done(err, null);
        done(null, user);
    })
})

module.exports = function(app, options) {
    // if success and failure redirects aren't specified,
    // set some reasonable defaults
    if(!options.successRedirect)
        options.successRedirect = '/account' ;
    if(!options.failureRedirect)
        options.failureRedirect = '/login';
    return {
        init: function() {
            var config = options.providers;
            // configure Facebook strategy
            passport.use(new FacebookStrategy({
                clientID: config.FB.clientID,
                clientSecret: config.FB.clientSecret,
                callbackURL: '/auth/facebook/callback',
            }, function(accessToken, refreshToken, profile, done) {
                var authId = 'facebook:' + profile. id;
                User.findOne({ authId: authId }), function(err, user){
                    if(err) return done(err, null);
                    if(user ) return done(null, user);
                    user = new User({
                        authId: authId,
                        name: profile. displayName,
                        created: Date.now(),
                        role: 'customer'
                    })
                    
                    user.save(function(err){
                        if(err) return done(err, null);
                        done(null, user);
                    })
                }
            }))

            app.use(passport. initialize());
            app.use(passport.session());
        },
        registerRoutes: function(){
            // register Facebook routes
            app.get('/auth/facebook' , function(req, res, next) {
                passport.authenticate( 'facebook' , {
                    callbackURL: '/auth/facebook/callback?redirect=' +
                        encodeURIComponent(req.query.redirect),
                })(req, res, next);
            })
            
            app.get('/auth/facebook/callback', passport.authenticate('facebook' ,
                { failureRedirect: options.failureRedirect },
                (req, res) => {
                    // we only get here on successful authentication
                    res.redirect(303, req.query.redirect || options.successRedirect);
                }
            ))
        },
    }
}