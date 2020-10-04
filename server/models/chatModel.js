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
    addNewMsg: async (convId, userId, msg, isRead) => {
        const sql = `INSERT INTO messages (conversation_id, user_id, message, is_read) VALUES (?,?,?,?)`
        return db.selectDB([convId, userId, msg, isRead], sql)
    },
    getMessages: async (id) => {
        const sql = `SELECT user_id,(SELECT username FROM users WHERE user_id = id) as username, message, created_at FROM messages WHERE conversation_id = ? ` +
        `ORDER BY created_at ASC`
        return db.selectDB([id], sql)
    },
    getUnreadMessages: async (id) => {
        const sql = `SELECT count(*) as unreadMsgs FROM messages WHERE user_id = ? AND is_read = 0`
        return db.selectDB([id], sql)
    },
    getConvUnreadMessages: async (id, convId) => {
        const sql = `SELECT count(*) as unreadMsgs FROM messages WHERE user_id = ? AND conversation_id = ? AND is_read = 0`
        return db.selectDB([id, convId], sql)
    },
    updateMsgStatut: async (id, convId) => {
        const sql = 'UPDATE messages SET is_read = 1 WHERE user_id = ? AND conversation_id = ? AND is_read = 0';
        return db.updateDB([id, convId], sql)
    },
}

module.exports = chat