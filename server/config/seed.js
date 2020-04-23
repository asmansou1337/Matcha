var chalk = require('chalk');
let jsonData = require('./users.json')
const crypto = require('crypto')
var mysql = require('mysql');

var cnx = mysql.createConnection({
	host     : 'localhost',
	port	 : 3306,
    user     : 'root',
	password : '', 
	charset : 'utf8mb4'
});

//console.log(jsonData)
let result = []
// default user
let defaultUser = {}
    defaultUser['id'] = 1
    defaultUser['gender'] = 'female'
    defaultUser['firstName'] = 'asmae'
    defaultUser['lastName'] = 'mansouri'
    defaultUser['username'] = 'asmansou'
    defaultUser['email'] = 'xidabev790@itiomail.com'
    defaultUser['latitude'] = '32.3373'
    defaultUser['longitude'] = '-6.3498'
    defaultUser['password'] = '$2b$10$piusHCpcbvnoVe4o3Rc/S.71QbJG8imZZVGAWtL7cQjUlj4AgzyU2'
    defaultUser['born_date'] = '1997-08-15 00:00:00'
    defaultUser['created_at'] = '2020-03-31 21:00:07'
    defaultUser['is_active'] = 1
    defaultUser['profilePic'] = 'woman-pic5.jpg'
    defaultUser['preference'] = 'bisexual'
    defaultUser['token'] = '813d654e0519df425f6af60786810a16a1061807daafc90a2c95e43093fdca501aa6bda03bed43cc'
    defaultUser['biography'] = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
    defaultUser['last_connection'] = '2020-04-11 16:53:36'
    defaultUser['tags'] = ['web', 'food', 'fashion', 'fitness']
    defaultUser['otherPics'] = ['other1.jpg','other3.jpg','other5.jpg','other7.jpg']
result.push(defaultUser)

let i = 1
// tags list
let tagsArray = ['web', 'webdesign', 'webdevelopment','webdev', 'webtoon', 'mobileapp', 'mobile', 'gaming', 'accessories', 'videos', 'travel', 'trip',
'photography', 'vacation', 'adventure', 'magic', 'food', 'style', 'fashion', 'love', 'dogs', 'cats', 'biking', 'baking', 'sleep', 'drawing', 'animationfestival',
'musicfestival', 'fitness' , 'inspiration', 'motivation', 'workout', 'art']
// user profile picture
let malePics = ['man-pic1.jpg', 'man-pic2.jpg','man-pic3.jpg','man-pic4.jpg','man-pic5.jpeg','man-pic6.jpeg']
let femalePics = ['woman-pic1.jpg','woman-pic2.jpeg','woman-pic3.jpg','woman-pic4.jpg','woman-pic5.jpg','woman-pic6.jpg']
let pref = ['heterosexual', 'homosexual', 'bisexual']
let otherPics = ['other1.jpg','other2.jpeg','other3.jpeg','other4.jpeg','other5.jpeg','other6.jpeg','other7.jpeg','other8.jpeg','other9.jpeg',
    'other10.jpeg','other11.jpeg',]
let tab = jsonData.results
tab.forEach(user => {
    let newUser = {}
    newUser['id'] = ++i
    newUser['gender'] = user.gender
    newUser['firstName'] = user.name.first
    newUser['lastName'] = user.name.last
    newUser['username'] = user.login.username
    newUser['email'] = user.email
    newUser['latitude'] = user.location.coordinates.latitude
    newUser['longitude'] = user.location.coordinates.longitude
    newUser['password'] = '$2b$10$piusHCpcbvnoVe4o3Rc/S.71QbJG8imZZVGAWtL7cQjUlj4AgzyU2'
    newUser['born_date'] = user.dob.date
    newUser['created_at'] = user.registered.date
    newUser['is_active'] = 1
    // profile pic
    if (user.gender == 'female') 
     newUser['profilePic'] = femalePics[Math.floor(Math.random() * femalePics.length)]
    else newUser['profilePic'] = malePics[Math.floor(Math.random() * malePics.length)];
    // preference
    newUser['preference'] = pref[Math.floor(Math.random() * pref.length)]; 
    // token
    newUser['token'] = crypto.randomBytes(40).toString('hex');
    // bio
    newUser['biography'] = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";
    // last connection
    newUser['last_connection'] = user.registered.date
    // tags
    // Shuffle array
    let shuffled = tagsArray.sort(() => 0.5 - Math.random());
    // Get sub-array of first n elements after shuffled
    newUser['tags'] = shuffled.slice(0, 3);
     // Shuffle array
    shuffled = otherPics.sort(() => 0.5 - Math.random());
     // other pictures 
     newUser['otherPics'] = shuffled.slice(0, 3);
    result.push(newUser)
});

console.log(chalk.yellow(JSON.stringify(result)))

cnx.connect(function(err) {
	if (err) {
		console.error(chalk.red('error: ' + err.stack));
		return;
	} else {
		console.log(chalk.green('connected successfully'));
		return;
	}
});

// Choosing matcha_db
cnx.query('USE matcha_db');
console.log(chalk.green('Database changed !'));


// filling users table
let sql = `INSERT INTO users `+
    `(firstName, lastName, username, email, password, is_active, gender, preference, biography, token, latitude, longitude, profilePic,`+
    `last_connection, born_date, created_at) VALUES `;
result.forEach((user, index) => {
    sql += `('${user.firstName}','${user.lastName}','${user.username}','${user.email}','${user.password}','${user.is_active}','${user.gender}','${user.preference}','${user.biography}',`+
        `'${user.token}','${user.latitude}','${user.longitude}','${user.profilePic}','${user.last_connection}','${user.born_date}','${user.created_at}')`
    if ((result.length - 1) !== index){
        sql += ','
    }
});
sql += ';'
// console.log(chalk.red(sql))
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('users added !'));
	}
});

// adding other pictures
sql = 'INSERT INTO pictures ' + 
    '(name, user_id) VALUES ';

result.forEach((user,i) => {
    user.otherPics.forEach((pic, index) => {
        sql += `('${pic}', ${user.id})`
        if ((user.otherPics.length - 1) !== index){
            sql += ','
        }
    });
    if ((result.length - 1) !== i){
        sql += ','
    }
});
sql += ';'
// console.log(chalk.red(sql))
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('other pics added !'));
	}
});

// adding tags 
sql = 'INSERT INTO tags ' + 
    '(name, user_id) VALUES ';

result.forEach((user,i) => {
    user.tags.forEach((tag, index) => {
        sql += `('${tag}', ${user.id})`
        if ((user.tags.length - 1) !== index){
            sql += ','
        }
    });
    if ((result.length - 1) !== i){
        sql += ','
    }
});
sql += ';'
// console.log(chalk.red(sql))
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('tags added !'));
	}
});

let nub = Math.floor(Math.random() * (25 - 10 + 1)) + 10;

// add likes
sql = 'INSERT INTO liked_profiles ' + 
    '(liker_user_id, liked_user_id) VALUES ';

result.forEach((user,i) => {
    // random profile to like
    // Shuffle array
    let shuffled = result.sort(() => 0.5 - Math.random());
    // Get sub-array of first n elements after shuffled
    let usersToLike = shuffled.slice(0, nub);
    usersToLike.forEach((likedUser, index) => {
        sql += `('${user.id}', ${likedUser.id})`
        if ((usersToLike.length - 1) !== index){
            sql += ','
        }
    });
    if ((result.length - 1) !== i){
        sql += ','
    }
});
sql += ';'
// console.log(chalk.red(sql))
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('likes added !'));
	}
});

nub = Math.floor(Math.random() * (25 - 10 + 1)) + 10;
// // add visits
sql = 'INSERT INTO visited_profiles ' + 
    '(visitor_user_id, visited_user_id, nbr_visits) VALUES ';

result.forEach((user,i) => {
    // random profile to like
    // Shuffle array
    let shuffled = result.sort(() => 0.5 - Math.random());
    // Get sub-array of first n elements after shuffled
    let usersVisited = shuffled.slice(0, nub);
    usersVisited.forEach((visitedUser, index) => {
        sql += `('${user.id}', ${visitedUser.id}, 1)`
        if ((usersVisited.length - 1) !== index){
            sql += ','
        }
    });
    if ((result.length - 1) !== i){
        sql += ','
    }
});
sql += ';'
// console.log(chalk.red(sql))
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('visits added !'));
	}
});

nub = Math.floor(Math.random() * (25 - 10 + 1)) + 10;
// add blocks
sql = 'INSERT INTO blocked_users ' + 
    '(blocker_user_id, blocked_user_id) VALUES ';

result.forEach((user,i) => {
    // random profile to like
    // Shuffle array
    let shuffled = result.sort(() => 0.5 - Math.random());
    // Get sub-array of first n elements after shuffled
    let usersBlocked = shuffled.slice(0, nub);
    usersBlocked.forEach((blockedUser, index) => {
        // if (user.id != 1 && blockedUser.id != 1) {
            sql += `(${user.id}, ${blockedUser.id})`
            if ((usersBlocked.length - 1) !== index){
                sql += ','
            }
        // }
    });
    if ((result.length - 1) !== i){
        sql += ','
    }
});
sql += ';'
// console.log(chalk.red(sql))
cnx.query(sql, function(err) {
	if (err) throw err;
	else {
		console.log(chalk.green('blocks added !'));
	}
});

//End of cnx
cnx.end();