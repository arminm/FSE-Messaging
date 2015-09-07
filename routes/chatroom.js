var express = require('express');
var router = express.Router();

// Database

var fs = require("fs");
var file = "database.db";
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

if(!exists) {
	db.run("CREATE TABLE messages (body TEXT, timestamp TEXT, sender TEXT)");
}
var messages = [];
db.serialize(function() {
  	db.each('SELECT rowid AS id, * FROM messages', function(err, row) {
    	messages.push(row);
  	});
});

db.close();

/* GET messages. */
router.get('/', function(req, res, next) {
  res.render('chatroom', { messages: messages, sender: req.query.name});
});

module.exports = router;
