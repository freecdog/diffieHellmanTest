
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var crypto = require('crypto');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var keys = {};
var alice = crypto.getDiffieHellman('modp5');
alice.generateKeys();

app.get('/', function(req, res){
    res.render('dh', { });
});

app.put('/diffie', function(req, res){
    // from http://nodejs.org/api/crypto.html#crypto_crypto_getdiffiehellman_group_name

    function generateKey(){
        bob.generateKeys();

        var publicKey = bob.getPublicKey().toString('base64');

        var alice_secret = alice.computeSecret(publicKey, 'base64', 'hex');
        //var bob_secret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

        /* alice_secret and bob_secret should be the same */
        //console.log(alice_secret == bob_secret, alice_secret.length, alice.getPublicKey().length);

        keys[publicKey] = alice_secret;     // current alice secret

        console.log(publicKey);
        return publicKey;
    }

    if (req.body.key in keys) {
        // #TODO compute and compare secret, if same then send it back else generate new one;

        if (alice.computeSecret(req.body.key, 'base64', 'hex') == keys[req.body.key]) {
            res.send({key: req.body.key, updated: false});
        } else {
            console.log('different secrets, get new key');
            res.send({key: generateKey(), updated: true});
        }
    } else {
        res.send({key: generateKey(), updated: true});
    }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
