const conn = require('../config/database');
const chalk = require('chalk');
const db = require('../models/databaseModel')

const notif = {
    addNotif: async (receiverId, senderId, message, link) => {
        const sql = 'INSERT INTO notifications (receiver_id, sender_id, message, link) VALUES (?,?,?,?)';
        return db.updateDB([receiverId, senderId, message, link], sql)
    },
    getUnreadNotif: async (id) => {
        const sql = `SELECT count(*) as unread FROM notifications WHERE receiver_id = ? AND is_read = 0`;
        return db.selectDB(id, sql)
    },
    getUserNotifications: async (id) => {
        const sql = `SELECT *,(SELECT profilePic FROM users WHERE id = sender_id) as profilePic FROM notifications WHERE receiver_id = ? ORDER BY created_at DESC`;
        return db.selectDB(id, sql)
    },
    updateNotifications: async (id) => {
        const sql = 'UPDATE notifications SET is_read = 1 WHERE receiver_id = ? AND is_read = 0';
        return db.updateDB([id], sql)
    },
}

module.exports = notif