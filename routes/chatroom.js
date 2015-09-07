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
 
  // 	var stmt = db.prepare('INSERT INTO messages VALUES (?, ?, ?)');
  // 	var date = new Date();
  // 	var options = { hour: '2-digit', minute: '2-digit', second: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' };
  // 	for (var i = 0; i < 10; i++) {
  // 		stmt.run('message ' + i, date.toLocaleDateString('en-US', options), 'Armin');
 	// }

  // 	stmt.finalize();

  	db.each('SELECT rowid AS id, * FROM messages', function(err, row) {
    	// console.log(row.id + ': ' + row.sender + ': ' + row.body + '  -  ' + row.timestamp);
    	messages.push(row);
  	});
});

db.close();

/* GET users listing. */
router.get('/', function(req, res, next) {

  res.render('chatroom', { messages: messages, sender: req.query.name});
});

module.exports = router;
