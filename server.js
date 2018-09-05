// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// init sqlite db
var fs = require('fs');
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function(){
  if (!exists) {
    db.run('CREATE TABLE users (id INT, username TEXT, password TEXT)');
    console.log('New table users created!');
  }
  else {
    console.log('Database "users" ready to go!');
    db.each('SELECT * from Dreams', function(err, row) {
      if ( row ) {
        console.log('record:', row);
      }
    });
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/search', function(request, response) {
  response.sendFile(__dirname + '/views/search.html');
});

app.get('/join', function(request, response) {
  response.redirect("https://zmdm.co/vv27");
});

app.get('/login', function(request, response) {
  response.sendFile(__dirname + '/views/login.html');
});

app.get('/signout', function(request, response) {
  response.sendFile(__dirname + '/views/signout.html');
});

app.get('/signin', function(request, response) {
  var url = require('url');
  var adr = request.url
  var q = url.parse(adr, true);

  console.log(q.host); //returns 'wl.glitch.me'
  console.log(q.pathname); //returns '/signin'
  console.log(q.search); //returns '?username=Blah&password=Blah'

  var qdata = q.query; //returns an object: { uername: blah, password: 'blah' }
  console.log(qdata.username); //returns Their Username
  
  if (qdata.username == "390105249") {
    if (qdata.password == "Lipscomb2007") {
      console.log("Login Successful.")
      response.redirect("/panel?id=" + qdata.id + "&Error=200");
    }
    else {
      console.log("Invalid Password.")
      response.redirect("/login?error=403")
    }
  }
  else {
    console.log("Invalid Username.")
    response.redirect("/login?error=403")
  }
});

app.get('/panel', function(request, response) {
  var url = require('url');
  var adr = request.url
  var q = url.parse(adr, true)

  
  var qdata = q.query;
  
  if (qdata.id == 1) {
    console.log("Identified User as WYATT LIPSCOMB")
    response.sendFile(__dirname + "/views/panel.html")
  }
  else if (qdata.id == 2) {
    console.log("Identified User as TOMMY LIPSCOMB")
    response.sendFile(__dirname + "/views/panel.html")
  }
  else if (qdata.id == 3) {
    console.log("Identified User as LORI LIPSCOMB")
    response.sendFile(__dirname + "/views/panel.html")
  }
  else if (qdata.id == 100) {
    console.log("Identified User as SYSTEM")
    response.sendFile(__dirname + "/views/panel.html")
  }
  else {
    console.log("INVALID USER IDENTIFER. PREVENTING ACCESS")
    response.redirect("https://wl.glitch.me/panel?id=100&error=404")
  }
});

app.get('/adduser', function(request, response) {
  console.log("Adding User to database.")
  var url = require('url');
  var adr = request.url
  var q = url.parse(adr, true)
  var qdata = q.query;
  if (qdata.id == undefined) {
    console.error("ID UNDEFINED")
    response.redirect("/panel?id=" + qdata.returnid + "&error=200");
  if (qdata.username == undefined) {
    console.error("USERNAME UNDEFINED")
    response.redirect("/panel?id=" + qdata.returnid + "&error=200");
  }
  if (qdata.password == undefined) {
    console.error("PASSWORD UNDEFINED")
    response.redirect("/panel?id=" + qdata.returnid + "&error=200");
  }
  db.run("INSERT INTO Users (Username, Password) VALUES (" + qdata.id + ", " + qdata.username + ", " + qdata.password + ")");
  }
});

// endpoint to get all the dreams in the database
// currently this is the only endpoint, ie. adding dreams won't update the database
// read the sqlite3 module docs and try to add your own! https://www.npmjs.com/package/sqlite3
app.get('/getDreams', function(request, response) {
  db.all('SELECT * from Dreams', function(err, rows) {
    response.send(JSON.stringify(rows));
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
