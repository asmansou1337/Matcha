const db = require('../models/databaseModel')

const chat = {
    getConversation: async (sender, receiver) => {
        const sql = `SELECT * FROM conversations WHERE (starter_user_id = ? AND receiver_user_id = ?) OR ` +
        `(starter_user_id = ? AND receiver_user_id = ?)`
        return db.selectDB([sender, receiver, receiver, sender], sql)
    },
    addConversation: async (sender, receiver) => {
        const sql = `INSERT INTO conversations (starter_user_id, receiver_user_id) VALUES (?,?)`
        return db.selectDB([sender, receiver], sql)
    },
    checkConversation: async (sender, receiver, convId) => {
        const sql = `SELECT * FROM conversations WHERE ((starter_user_id = ? AND receiver_user_id = ?) OR ` +
        `(starter_user_id = ? AND receiver_user_id = ?)) AND id = ?`
        return db.selectDB([sender, receiver, receiver, sender, convId], sql)
    },
    addNewMsg: async (convId, userId, msg) => {
        const sql = `INSERT INTO messages (conversation_id, user_id, message) VALUES (?,?,?)`
        return db.selectDB([convId, userId, msg], sql)
    },
    getMessages: async (id) => {
        const sql = `SELECT user_id,(SELECT username FROM users WHERE user_id = id) as username, message, created_at FROM messages WHERE conversation_id = ? ` +
        `ORDER BY created_at ASC`
        return db.selectDB([id], sql)
    },
}

module.exports = chat