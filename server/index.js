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
    secret: process.env.SECRET || 'SECRET', // set this encryption key in Heroku config (never in GitHub)!
    resave: false,
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
            return done(null, false, { 'message': 'Wrong username' });
        }
        if (!validatePassword(username, password)) {
            // invalid password
            // should disable logins after N messages
            // delay return to rate-limit brute-force attacks
            await new Promise((r) => setTimeout(r, 2000)); // two second delay
            return done(null, false, { 'message': 'Wrong password' });
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
app.use(express.urlencoded({ 'extended': true })); // allow URLencoded data

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
        } catch (ignored) {

        }
    }
}

async function insertWallet(wbalance, amount, account) {
    console.log(wbalance, amount, account);
    return await connectAndRun(db => db.any("INSERT INTO wallethistory Values(NULL, $1, $2, $3, $4, $5, $6, $7, $8);", [transactTime, transactType, amount, fee, address, transactStatus, walletBallance, userid]));
}

async function getTradeHistory() {
    return await connectAndRun(db => db.any("SELECT * FROM Trades;"));
}

async function getWalletHistory() {
    return await connectAndRun(db => db.any("SELECT * FROM wallethistory;"));
}

async function getWinLossCounts() {
    return await connectAndRun(db => db.any(
        "SELECT (SELECT COUNT(pnl) FROM trades WHERE pnl > 0) AS first, (SELECT COUNT(-pnl) FROM trades WHERE pnl < 0) AS second;"));
}

async function getGainsLosses() {
    return await connectAndRun(db => db.any(
        "SELECT (SELECT SUM(pnl) FROM trades WHERE pnl > 0) AS first, (SELECT SUM(-pnl) FROM trades WHERE pnl < 0) AS second;"));
}

async function insertUser(user, salt, hash) {
    return await connectAndRun(db => db.any("INSERT INTO users Values($1, $2, $3);", [user, salt, hash]));
}

async function getUserInfo(user) {
    return await connectAndRun(db => db.any("SELECT * FROM users where username = $1", user));
}

async function userExists(user) {
    return await connectAndRun(db => db.any("SELECT username FROM users where username = $1", user));
}

async function getAvgGainLoss() {
    return await connectAndRun(db => db.any(
        "SELECT (SELECT AVG(pnl) FROM trades WHERE pnl > 0) AS first, (SELECT AVG(-pnl) FROM trades WHERE pnl < 0) AS second;"));
}

async function getBestGainWorstLoss() {
    return await connectAndRun(db => db.any(
        "SELECT (SELECT MAX(pnl) FROM trades) AS first, (SELECT MAX(-pnl) FROM trades) AS second;"));

}

// user functions

// Returns true iff the user exists.
async function findUser(username) {
    console.log((await userExists(username)).length);
    if ((await userExists(username)).length) {
        return true;
    } else {
        return false;
    }
}

// Returns true iff the password is the one we have stored (in plaintext = bad but easy).
async function validatePassword(name, pwd) {
    console.log('here');
    if (!findUser(name)) {
        return false;
    }
    const info = (await getUserInfo(name))[0];
    console.log('logging in');
    console.log(name);
    const result = mc.check(pwd, info['salt'], info['hash']);
    console.log(result);
    return result;
}

// Add a user to the "database".
async function addUser(name, pwd) {
    if (await findUser(name)) {
        return false;
    }
    const [salt, hash] = mc.hash(pwd);
    insertUser(name, [salt, hash][0], [salt, hash][1]);
    return true;
}

// Routes

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // If we are authenticated, run the next route.
        next();
    } else {
        // Otherwise, redirect to the login page.
        res.redirect('/account');
    }
}

// Handle post data from the account.html form.
app.post('/account',
    passport.authenticate('local', {     // use username/password authentication
        'successRedirect': '/private',   // when we login, go to /private 
        'failureRedirect': '/account'      // otherwise, back to login
    }));

// Handle the URL /login (just output the login.html file).
app.get('/account',
    (req, res) => res.redirect('/account.html'));

// Handle logging out (takes us back to the login page).
app.get('/logout', (req, res) => {
    req.logout(); // Logs us out!
    res.redirect('/account'); // back to login
});


// Like login, but add a new user and password IFF one doesn't exist already.
// If we successfully add a new user, go to /login, else, back to /register.
// Use req.body to access data (as in, req.body['username']).
// Use res.redirect to change URLs.
app.post('/register',
    async (req, res) => {
        const username = req.body['username'];
        const password = req.body['password'];
        if (await addUser(username, password)) {
            res.redirect('/account');
        } else {
            res.redirect('/register');
        }
    });

// Register URL
app.get('/register',
    (req, res) => res.redirect('/register.html'));

// Private data
app.get('/private',
    checkLoggedIn, // If we are logged in (notice the comma!)...
    (req, res) => {             // Go to the user's page.
        res.redirect('/private/' + req.user);
    });

//
// A dummy page for the user.
app.get('/private/:userID/',
    checkLoggedIn, // We also protect this route: authenticated...
    (req, res) => {
        // Verify this is the right user.
        if (req.params.userID === req.user) {
            res.redirect('/account_private.html');
        } else {
            res.redirect('/private/');
        }
    });

app.get("/tradeHistory", async (req, res) => {
    const tradeList = await getTradeHistory();
    res.send(JSON.stringify(tradeList));
});

app.get("/walletHistory", async (req, res) => {
    const wallet = await getWalletHistory();
    res.send(JSON.stringify(wallet));
});

app.get("/winLoss", async (req, res) => {
    const counts = await getWinLossCounts();
    res.send(JSON.stringify(counts));
});

app.get("/gainsLosses", async (req, res) => {
    const counts = await getGainsLosses();
    res.send(JSON.stringify(counts));
});

app.get("/avgGainLoss", async (req, res) => {
    const counts = await getAvgGainLoss();
    res.send(JSON.stringify(counts));
});

app.get("/bestGainWorstLoss", async (req, res) => {
    const counts = await getBestGainWorstLoss();
    res.send(JSON.stringify(counts));
});

app.use(express.static('client'));

app.get('*', (req, res) => {
    res.send('Error');
});

app.listen(port, () => {
    console.log(`App now listening at http://localhost:${port}`);
});