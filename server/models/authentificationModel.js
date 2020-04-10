const db = require('../models/databaseModel')

const Auth = {
    register: async (data) => {
        const sql = 'INSERT INTO users SET ?';
        return db.insertdb(data, sql)
    },
    verifyTokenExists: async (token) => {
        const sql = 'SELECT count(token) as count FROM users WHERE token = ?';
        return db.selectDB(token, sql)
    },
    verifyAccountActivated: async (token) => {
        const sql = 'SELECT count(*) as count FROM users WHERE token = ? AND is_active = 1';
        return db.selectDB(token, sql)
    },
    activateAccount: async (token) => {
        const sql = 'UPDATE users SET is_active = 1 WHERE token = ?';
        return db.updateDB(token, sql)
    },
    verifLoginInfo: async (username) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        return db.selectDB(username, sql)
    },
    getUserInfos: async (str, value) => {
        const sql = `SELECT * FROM users WHERE ${str} = ?`;
        return db.selectDB(value, sql)
    },
    resetToken: async (newToken, token) => {
        const sql = 'UPDATE users SET token = ? WHERE token = ?';
        return db.updateDB([newToken, token], sql)
    },
    updateStatut: async (id) => {
        const sql = 'UPDATE users SET is_online = 1 WHERE id = ?';
        return db.updateDB([id], sql)
    },
    logout: async (id) => {
        const sql = 'UPDATE users SET is_online = 0, last_connection = NOW() WHERE id = ?';
        return db.updateDB([id], sql)
    },
}

module.exports = Auth;