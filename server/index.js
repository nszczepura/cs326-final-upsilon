'use strict';

// For loading environment variables.
require('dotenv').config();

const request = require('request');
const crypto = require('crypto');
const pgPromise = require('pg-promise');
const pgp = pgPromise({});
const express = require('express');                 // express routing
const expressSession = require('express-session');  // for managing session state
const passport = require('passport');               // handles authentication
const LocalStrategy = require('passport-local').Strategy; // username/password strategy
const app = express();
const port = process.env.PORT || 8080;
const minicrypt = require('./miniCrypt');

const mc = new minicrypt();

// Local PostgreSQL credentials
const username = "postgres";
const password = "admin";

// Session configuration

const session = {
    secret : process.env.SECRET || 'SECRET', // set this encryption key in Heroku config (never in GitHub)!
    resave : false,
    saveUninitialized: false
};

//postgres db configuration
const url = process.env.DATABASE_URL || `postgres://${username}:${password}@localhost/`;
const db = pgp(url);

// Passport configuration

const strategy = new LocalStrategy(
    async (username, password, done) => {
    if (!findUser(username)) {
        // no such user
        return done(null, false, { 'message' : 'Wrong username' });
    }
    if (!validatePassword(username, password)) {
        // invalid password
        // should disable logins after N messages
        // delay return to rate-limit brute-force attacks
        await new Promise((r) => setTimeout(r, 2000)); // two second delay
        return done(null, false, { 'message' : 'Wrong password' });
    }
    // success!
    // should create a user object here, associated with a unique identifier
    return done(null, username);
    });


// App configuration

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

// Convert user object to a unique identifier.
passport.serializeUser((user, done) => {
    done(null, user);
});
// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
    done(null, uid);
});

app.use(express.json()); // allow JSON inputs
app.use(express.urlencoded({'extended' : true})); // allow URLencoded data

/////

// temp in-memory "database"
// let users = { 'upsilon' : 'compsci326' } // default user
let users = { 'upsilon' : [
  '2401f90940e037305f71ffa15275fb0d',
  '61236629f33285cbc73dc563cfc49e96a00396dc9e3a220d7cd5aad0fa2f3827d03d41d55cb2834042119e5f495fc3dc8ba3073429dd5a5a1430888e0d115250'
] };

let userMap = {};

// database functions

async function connectAndRun(task) {
    let connection = null;

    try {
        connection = await db.connect();
        return await task(connection);
    } catch (e) {
        throw e;
    } finally {
        try {
            connection.done();
        } catch(ignored) {

        }
    }
}

async function getTradeHistory() {
    return await connectAndRun(db => db.any("SELECT * FROM Trades;"));
}

// user functions

// Returns true iff the user exists.
function findUser(username) {
    if (!users[username]) {
    return false;
    } else {
    return true;
    }
}

// Returns true iff the password is the one we have stored (in plaintext = bad but easy).
function validatePassword(name, pwd) {
    if (!findUser(name)) {
    return false;
    }
    const res = mc.check(pwd, users[name][0], users[name][1]);
    return res;
}

// Add a user to the "database".
function addUser(name, pwd) {
    if (findUser(name)) {
    return false;
    }
    const [salt, hash] = mc.hash(pwd);
    users[name] = [salt, hash];
    return true;
}

// Routes

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
    // If we are authenticated, run the next route.
    next();
    } else {
    // Otherwise, redirect to the login page.
    res.redirect('/login');
    }
}

async function bitmexWalletHistory(apiKey, apiSecret) {

    const verb = 'GET';
    const path = '/api/v1/user/walletHistory';
    const expires = Math.round(new Date().getTime() / 1000) + 60; // 1 min in the future

    const signature = crypto.createHmac('sha256', apiSecret)
      .update(verb + path + expires)
      .digest('hex');

    const headers = {
      'content-type' : 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'api-expires': expires,
      'api-key': apiKey,
      'api-signature': signature
    };

    const requestOptions = {
      headers: headers,
      url: 'https://bitmex.com' + path,
      method: verb
    };

    return new Promise(function(resolve, reject) {
      request(requestOptions, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body);
        }
        else {
          reject(error);
        }
      });
  });
}

// Handle post data from the login.html form.
app.post('/login',
     passport.authenticate('local' , {     // use username/password authentication
         'successRedirect' : '/private',   // when we login, go to /private 
         'failureRedirect' : '/login'      // otherwise, back to login
     }));

// Handle the URL /login (just output the login.html file).
app.get('/login',
    (req, res) => res.sendFile('html/login.html',
                   { 'root' : __dirname }));

// Handle logging out (takes us back to the login page).
app.get('/logout', (req, res) => {
    req.logout(); // Logs us out!
    res.redirect('/login'); // back to login
});


// Like login, but add a new user and password IFF one doesn't exist already.
// If we successfully add a new user, go to /login, else, back to /register.
// Use req.body to access data (as in, req.body['username']).
// Use res.redirect to change URLs.
app.post('/register',
     (req, res) => {
         const username = req.body['username'];
         const password = req.body['password'];
         if (addUser(username, password)) {
         res.redirect('/login');
         } else {
         res.redirect('/register');
         }
     });

// Register URL
app.get('/register',
    (req, res) => res.sendFile('html/register.html',
                   { 'root' : __dirname }));

// Private data
app.get('/private',
    checkLoggedIn, // If we are logged in (notice the comma!)...
    (req, res) => {             // Go to the user's page.
        res.redirect('/private/' + req.user);
    });

// A dummy page for the user.
app.get('/private/:userID/',
    checkLoggedIn, // We also protect this route: authenticated...
    (req, res) => {
        // Verify this is the right user.
        if (req.params.userID === req.user) {
        res.writeHead(200, {"Content-Type" : "text/html"});
        res.write('<H1>HELLO ' + req.params.userID + "</H1>");
        res.write('<br/><a href="/logout">click here to logout</a>');
        res.end();
        } else {
        res.redirect('/private/');
        }
    });

app.get("/tradeHistory", async (req, res) => {
    const tradeList = await getTradeHistory();
    res.send(JSON.stringify(tradeList));
});

app.use(express.static('client'));

app.get('*', (req, res) => {
  res.send('Error');
});

app.listen(port, () => {
    console.log(`App now listening at http://localhost:${port}`);
});


async function insertWallet(wbalance, amount, account) {
  console.log(wbalance, amount, account);
  return await connectAndRun(db => db.any("INSERT INTO wallethistory Values(NULL, $1, $2, $3);", [wbalance, amount, account]));
}

async function get_data(){
  //test log
  const account = 'testuser';
  let test = await bitmexWalletHistory('gdza2Kt5rl0dONExkC8vGGS8', 'VUANpNaXhGxpRlOjMhdQN0c5g994LyMTrQZ8nozjVGsbQBMs');
  let test_json = JSON.parse(test);
  for(let i = 0; i < test_json.length; i++){
    let wbalance = test_json[i]['walletBalance'];
    let amount = test_json[i]['amount'];
    await insertWallet(wbalance, amount, account);
  }
}

get_data();