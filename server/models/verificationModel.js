const db = require('../models/databaseModel')

const verif = {
    verifyUsernameExists: async (username) => {
        const sql = 'SELECT count(username) as count FROM users WHERE username = ?';
        return db.selectDB(username, sql);
    },
    verifyEmailExists: async (email) => {
        const sql = 'SELECT count(email) as count FROM users WHERE email = ?';
        return db.selectDB(email, sql)
    },
}

module.exports = verif