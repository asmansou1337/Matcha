//Setting up the database and the tables
var chalk = require('chalk');
var mysql = require('mysql');

var cnx = mysql.createConnection({
	host     : 'localhost',
	port	 : 3306,
    user     : 'root',
    password: '', 
});

//Catching errors

cnx.connect(function(err) {
	if (err) {
		console.error(chalk.red('error: ' + err.stack));
		return;
	} else {
		console.log(chalk.green('connected successfully'));
		return;
	}
});

//Database creation

cnx.query('CREATE DATABASE IF NOT EXISTS matcha_db', (error, results, fields) => {
    if (error) {
        console.log(chalk.red("Error Creating Database"));
        return;
    }
    console.log(chalk.green('Database matcha Created !'));
});

// Choosing matcha_db
cnx.query('USE matcha_db');
console.log(chalk.green('Database changed !'));


// Filling database

// user Table
var sql = 'CREATE TABLE IF NOT EXISTS users (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,';
sql += '`username`  varchar(100)  NOT NULL,';
sql += '`email`  varchar(300)  NOT NULL,';
sql += '`password` varchar(200) NOT NULL,';
sql += '`is_active` int(11) NOT NULL DEFAULT 0,';
sql += '`gender_id` int(11) NOT NULL DEFAULT 3,';
sql += '`preference_id` int(11) NOT NULL DEFAULT 3,';
sql += '`firstName` varchar(100) NOT NULL,';
sql += '`lastName` varchar(100) NOT NULL,';
sql += '`token` varchar(100)  NOT NULL,';
sql += '`biography` TEXT  NOT NULL,';
sql += '`gps_location` varchar(200)  NOT NULL,';
sql += '`last_connection` datetime,';
sql += '`born_date` datetime,';
sql += '`notify` int(11)  NOT NULL DEFAULT 1,';
sql += '`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP';
sql += ') CHARACTER SET utf8 COLLATE utf8_general_ci';
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('Table users created !'));
	}
});


// Table genders
var sql = 'CREATE TABLE IF NOT EXISTS genders (';
sql += 'id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,';
sql += '`title` varchar(300) NOT NULL,';
sql += '`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP';
sql += ') CHARACTER SET utf8 COLLATE utf8_general_ci';
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('Table genders created !'));
	}
});

// Table preferences
var sql = 'CREATE TABLE IF NOT EXISTS preferences (';
sql += 'id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,';
sql += '`title` varchar(300) NOT NULL,';
sql += '`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP';
sql += ') CHARACTER SET utf8 COLLATE utf8_general_ci';
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('Table preferences created !'));
	}
});

// Table tags
var sql = 'CREATE TABLE IF NOT EXISTS tags (';
sql += 'id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,';
sql += '`title` varchar(300) NOT NULL,';
sql += '`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP';
sql += ') CHARACTER SET utf8 COLLATE utf8_general_ci';
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('Table tags created !'));
	}
});

// Table user tags
var sql = 'CREATE TABLE IF NOT EXISTS user_tags (';
sql += 'id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,';
sql += '`tag_id` int(11) NOT NULL,';
sql += '`user_id` int(11) NOT NULL,';
sql += '`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP';
sql += ') CHARACTER SET utf8 COLLATE utf8_general_ci';
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('Table user tags created !'));
	}
});

// Table picture
var sql = 'CREATE TABLE IF NOT EXISTS pictures (';
sql += 'id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,';
sql += '`title` varchar(300) NOT NULL,';
sql += '`pic_path` varchar(300),';
sql += '`user_id` int(11) NOT NULL,';
sql += '`is_profile` int(11) DEFAULT 0,';
sql += '`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP';
sql += ') CHARACTER SET utf8 COLLATE utf8_general_ci';
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('Table pictures created !'));
	}
});

// Table reported_users
var sql = 'CREATE TABLE IF NOT EXISTS reported_users (';
sql += 'id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,';
sql += '`reported_user_id` int(11) NOT NULL,';
sql += '`reporter_user_id` int(11) NOT NULL,';
sql += '`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP';
sql += ') CHARACTER SET utf8 COLLATE utf8_general_ci';
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('Table reported_users created !'));
	}
});

// Table blocked_users
var sql = 'CREATE TABLE IF NOT EXISTS blocked_users (';
sql += 'id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,';
sql += '`blocked_user_id` int(11) NOT NULL,';
sql += '`blocker_user_id` int(11) NOT NULL,';
sql += '`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP';
sql += ') CHARACTER SET utf8 COLLATE utf8_general_ci';
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('Table blocked_users created !'));
	}
});

// Table visited_profiles
var sql = 'CREATE TABLE IF NOT EXISTS visited_profiles (';
sql += 'id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,';
sql += '`visitor_user_id` int(11) NOT NULL,';
sql += '`visited_user_id` int(11) NOT NULL,';
sql += '`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP';
sql += ') CHARACTER SET utf8 COLLATE utf8_general_ci';
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('Table visited_profiles created !'));
	}
});

// Table liked_profiles
var sql = 'CREATE TABLE IF NOT EXISTS liked_profiles (';
sql += 'id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,';
sql += '`liker_user_id` int(11) NOT NULL,';
sql += '`liked_user_id` int(11) NOT NULL,';
sql += '`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP';
sql += ') CHARACTER SET utf8 COLLATE utf8_general_ci';
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('Table liked_profiles created !'));
	}
});

// Table conversations
var sql = 'CREATE TABLE IF NOT EXISTS conversations (';
sql += 'id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,';
sql += '`starter_user_id` int(11) NOT NULL,';
sql += '`receiver_user_id` int(11) NOT NULL,';
sql += '`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP';
sql += ') CHARACTER SET utf8 COLLATE utf8_general_ci';
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('Table conversations created !'));
	}
});

// Table messages
var sql = 'CREATE TABLE IF NOT EXISTS messages (';
sql += 'id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,';
sql += '`conversation_id` int(11) NOT NULL,';
sql += '`user_id` int(11) NOT NULL,';
sql += '`message` TEXT NOT NULL,';
sql += '`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP';
sql += ') CHARACTER SET utf8 COLLATE utf8_general_ci';
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('Table conversations created !'));
	}
});

// Table notifications
var sql = 'CREATE TABLE IF NOT EXISTS notifications (';
sql += 'id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,';
sql += '`title` varchar(300) NOT NULL,';
sql += '`description` TEXT NOT NULL,';
sql += '`user_id` int(11) NOT NULL,';
sql += '`is_read` int(11) NOT NULL DEFAULT 0,';
sql += '`link` varchar(300) NOT NULL DEFAULT \'home\',';
sql += '`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP';
sql += ') CHARACTER SET utf8 COLLATE utf8_general_ci';
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('Table notifications created !'));
	}
});

// Fill Tabe gender
genders = [
    {title: "male"},
    {title: "female"},
    {title: "other"}
];

genders.forEach(g => {
    var sql = 'INSERT INTO genders SET ?';
    cnx.query(sql, g, function(err) {
      if (err) throw err;
      else {
          console.log(chalk.green('Infos inserted into genders table !'));
      }
    });
  });

// Fill Tabe preference
preferences = [
    {title: "heterosexual"},
    {title: "homosexual"},
    {title: "bisexual"}
];

preferences.forEach(p => {
    var sql = 'INSERT INTO preferences SET ?';
    cnx.query(sql, p, function(err) {
      if (err) throw err;
      else {
          console.log(chalk.green('Infos inserted into preferences table !'));
      }
    });
  });


//End of cnx
cnx.end();
