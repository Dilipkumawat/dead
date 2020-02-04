var request = require("request");
http = require("http");
util = require("util");
fs = require('fs-extra');
path = require('path');
net = require('net');
config = require('./config');
PORT = config.port;
ComouterVisionServices = require('./services.js');
var fs = require('fs-extra');
// node modules
var express = require('express');
var bodyParser = require('body-parser');
// configs
var mysql = require('mysql');
var pool = mysql.createPool({
    host: config.mysql_host,
    user: config.mysql_user,
    password: config.mysql_password,
    database: config.mysql_database,

});

// parse body data
var app = express();
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

// listen clients
var server = app.listen(config.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log(config.SITE_TITLE, 'listening on port', port);
});

// allow cross origin domain
        app.use(function (req, res, next) {
            var userdata = req.body;
            if (config.DEBUG > 0)
                console.log('####################################### ' + req.url + ' API IS CALLED WITH DATA: ', userdata);

            fs.writeFile("postdata.txt", JSON.stringify(userdata), function (err22) {
            });

            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            console.log('Auth login section');
            // check if user is exists or not
            var currentUser = userdata.sid;
            next();
            /*if (currentUser != undefined && currentUser != "") {
                Users.is_user_exists(currentUser, pool, function (http_status_code, err, response) {

                    if (err) {
                        throw err;
                    }
                    //console.log(http_status_code);

                    if (http_status_code == 200) {
                        // forward to next route
                        next();
                    } else {
                        if (config.DEBUG == 2) {
                            console.log();
                            console.log(response);
                            console.log();
                        }
                        // invalid login id
                        res.status(http_status_code).send(response);
                    }
                });
            } else {
                // forward to next route
                next();
            }*/

            
});

app.post('/getColor', function (req, res) {
    var userdata = req.body;
    ComouterVisionServices.getColor(userdata, pool, function (http_status_code, err, response) {
        if (err) {
            throw err;
        }
        if (config.DEBUG == 2)
        console.log(response);
        res.status(http_status_code).send(response);
    });
});