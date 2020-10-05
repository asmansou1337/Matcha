const conn = require('../config/database');
const chalk = require('chalk');
const bcrypt = require('bcrypt');
const db = require('../models/databaseModel');
const notif = require('./notifModel');

const Auth = {
    updatePassword: async (password, value, str) => {
        const sql = `UPDATE users SET password = ? WHERE ${str} = ?`;
        return db.updateDB([password, value], sql)
    },
    updatebasic: async (firstName, lastName, username, email, gender, orientation, birthDay, bio, id) => {
        const sql = 'UPDATE users SET firstName = ?, lastName = ?, username = ?, email = ?, gender = ?, '+
        'preference = ?, born_date = ?, biography = ? WHERE id = ?';
        return db.updateDB([firstName, lastName, username, email, gender, orientation, birthDay, bio, id], sql)
    },
    updateProfilePic: async (name, id) => {
        const sql = 'UPDATE users SET profilePic = ? WHERE id = ?';
        return db.updateDB([name, id], sql)
    },
    getUserProfile: async (id) => {
        const sql = `SELECT id, username, firstName, lastName, email, gender, preference, biography, ` +
        `latitude, longitude, profilePic, is_online as online, last_connection, DATE_FORMAT(born_date, "%Y-%m-%d") as born_date, notify, ` +
        `(SELECT GROUP_CONCAT(name SEPARATOR ',') FROM pictures WHERE user_id = ?) as otherPictures, ` +
        `(SELECT GROUP_CONCAT(name SEPARATOR ',') FROM tags WHERE user_id = ?) as tags FROM users WHERE id = ?`;
        return db.selectDB([id, id, id], sql)
    },
    getProfilePic: async (id) => {
        const sql = `SELECT profilePic FROM users WHERE id = ?`;
        return db.selectDB(id, sql)
    },
    addNewPic: async (data) => {
        const sql = 'INSERT INTO pictures SET ?';
        return db.updateDB(data, sql)
    },
    deletePic: async (name, id) => {
        const sql = 'DELETE FROM pictures WHERE name = ? AND user_id = ?';
        return db.updateDB([name, id], sql)
    },
    getCountPics: async (id) => {
        const sql = `SELECT count(*) as count FROM pictures WHERE user_id = ?`;
        return db.selectDB(id, sql)
    },
    deleteTags: async (id) => {
        const sql = 'DELETE FROM tags WHERE user_id = ?';
        return db.updateDB(id, sql)
    },
    addTags: async (data) => {
        const sql = 'INSERT INTO tags (name, user_id) VALUES ?';
        return db.updateDB([data], sql)
    },
    getTagsList: async () => {
        const sql = 'SELECT DISTINCT name FROM tags';
        return db.selectDB('', sql)
    },
    updateLocation: async (lat, long, id) => {
        const sql = 'UPDATE users SET latitude = ?, longitude = ? WHERE id = ?';
        return db.updateDB([lat, long, id], sql)
    },
    getNotifSetting: async (id) => {
        const sql = `SELECT notify FROM users WHERE id = ?`;
        return db.selectDB(id, sql)
    },
    updateNotifSetting: async (id, notify) => {
        const sql = `UPDATE users SET notify = ? WHERE id = ?`;
        return db.updateDB([notify, id], sql)
    },

}

module.exports = Auth;