const express = require("express");
const app = express();

const port = process.env.PORT || 5000;

/**************************************
* Database setup
**************************************/
require('dotenv').config();
const connectionString = process.env.DATABASE_URL;

const { Pool } = require('pg')
const pool = new Pool({connectionString: connectionString});

/**************************************
* Session
**************************************/
var session = require('express-session');

app.use(session({
    secret: 'keyboard-cat'
}));


/**************************************
* lets the post queries be easily read
**************************************/
// to support JSON-encoded bodies
app.use(express.json());

// to support URL-encoded bodies
app.use(express.urlencoded({extended:true})); 

/**************************************
* set up ejs
**************************************/
app.set("views", "views");
app.set("view engine", "ejs");



/**************************************
* Routing
**************************************/
// public dir
app.use(express.static("public"));

app.use(logRequest);

app.post('/login',  login);
app.post('/logout', logout);

app.get('/getServerTime', verifyLogin, getServerTime);
/***************************************
* Turn it on
***************************************/
app.listen(port, function() {
    console.log("Server listening on: " + port);
});



function login(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    console.log(`username: ${username}`);
    console.log(`password: ${password}`);

    if (username == "admin" && password == "password"){
        if (!req.session.user) {
            req.session.user = {
                username: username
            };
        }

        const params = {
            success: true
        }; 

        res.json(params);
    } else {
        const params = {
            success: false
        };

        res.json(params); 
    }
}

function logout(req, res) {
    if (typeof req.session.user == 'undefined') {
        req.session.user = undefined;

        const params = {
            success: false
        }; 
    
        res.json(params);
    } else {
        req.session.destroy();

        const params = {
            success: true
        }; 

        res.json(params);
    }
}

function getServerTime(req, res) {

    const params = {
        success: true,
        time: new Date()
    }; 

    res.json(params);
}

function logRequest(req, res, next) {
    console.log("Received a request for: " + req.url);

    next();
}

function verifyLogin(req, res, next) {
    if (!(typeof req.session.user == 'undefined'))
    {
        next();
    } 

    const params = {
        error: 'cannot access this page'
    }; 

    res.status(401);
    res.json(params);
}