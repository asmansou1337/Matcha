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
    verifyUserExists: async (id) => {
        const sql = 'SELECT count(id) as count FROM users WHERE id = ?';
        return db.selectDB(id, sql);
    },
    verifyProfileComplete: async (id) => {
        const sql = 'SELECT is_complete as complete FROM users WHERE id = ?';
        return db.selectDB(id, sql);
    },
}

module.exports = verif