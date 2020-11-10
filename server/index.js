import * as _pgp from "pg-promise";
import * as _express from "express";
import {readFileSync} from "fs";
const express = _express["default"];
const pgp = _pgp["default"]({
    connect(client) {
        console.log('Connected to database:', client.connectionParameters.database);
    },

    disconnect(client) {
        console.log('Disconnected from database:', client.connectionParameters.database);
    }
});

// Local PostgreSQL credentials
const username = "postgres";
const password = "admin";

const url = process.env.DATABASE_URL || `postgres://${username}:${password}@localhost/`;
const db = pgp(url);

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
    //return JSON.parse(readFileSync("sample.json"));
}

async function registerUser(user, password) {
    return await connectAndRun(db => db.none("INSERT INTO Accounts VALUES ($1, $2);", [name, password]));
}

const app = express();
app.get("/tradeHistory", async (req, res) => {
    const tradeList = await getTradeHistory();
    res.send(JSON.stringify(tradeList));
});

app.post("/register", async (req, res) => {
    let body = '';
    req.on('data', data => body += data);
    req.on('end', () => {
        const data = JSON.parse(body);
        registerUser(data.name, data.password);
    });
    res.send("OK");
});

app.use(express.static('client'));

app.listen(process.env.PORT || 8080);