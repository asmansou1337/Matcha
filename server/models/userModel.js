const conn = require('../config/database');
const chalk = require('chalk');
const bcrypt = require('bcrypt');
const db = require('../models/databaseModel')

const user = {
    checkBlock: async (blockerID, blockedID) => {
        const sql = "SELECT * FROM blocked_users WHERE (blocked_user_id = ? AND blocker_user_id = ?) OR (blocked_user_id = ? AND blocker_user_id = ?)"
        return db.selectDB([blockerID, blockedID, blockedID, blockerID], sql)
    },
    checkBlocked: async (blockerID, blockedID) => {
        const sql = "SELECT * FROM blocked_users WHERE blocker_user_id = ? AND blocked_user_id = ?"
        return db.selectDB([blockerID, blockedID], sql)
    },
    checkReported: async (reporterID, reportedID) => {
        const sql = "SELECT * FROM reported_users WHERE reporter_user_id = ? AND reported_user_id = ?"
        return db.selectDB([reporterID, reportedID], sql)
    },
    checkLiked: async (likerID, likedID) => {
        const sql = "SELECT * FROM liked_profiles WHERE liker_user_id = ? AND liked_user_id = ?"
        return db.selectDB([likerID, likedID], sql)
    },
    checkVisited: async (visiterID, visitedID) => {
        const sql = "SELECT * FROM visited_profiles WHERE visitor_user_id = ? AND visited_user_id = ?"
        return db.selectDB([visiterID, visitedID], sql)
    },
    updatePassword: async (password, value, str) => {
        const sql = `UPDATE users SET password = ? WHERE ${str} = ?`;
        return db.updateDB([password, value], sql)
    },
    addLike: async (data) => {
        const sql = 'INSERT INTO liked_profiles SET ?';
        return db.updateDB(data, sql)
    },
    deleteLike: async (likerID, likedID) => {
        const sql = 'DELETE FROM liked_profiles WHERE liker_user_id = ? AND liked_user_id = ?';
        return db.updateDB([likerID, likedID], sql)
    },
    addBlock: async (data) => {
        const sql = 'INSERT INTO blocked_users SET ?';
        return db.updateDB(data, sql)
    },
    deleteBlock: async (blockerID, blockedID) => {
        const sql = 'DELETE FROM blocked_users WHERE blocker_user_id = ? AND blocked_user_id = ?';
        return db.updateDB([blockerID, blockedID], sql)
    },
    addReport: async (data) => {
        const sql = 'INSERT INTO reported_users SET ?';
        return db.updateDB(data, sql)
    },
    addVisit: async (data) => {
        const sql = 'INSERT INTO visited_profiles SET ?';
        return db.updateDB(data, sql)
    },
    updateVisit: async (visiterID, visitedID) => {
        const sql = 'UPDATE visited_profiles SET nbr_visits = nbr_visits + 1 WHERE visitor_user_id = ? AND visited_user_id = ?';
        return db.updateDB([visiterID, visitedID], sql)
    },
    checkLikeRelation: async (likerID, likedID) => {
        const sql = "SELECT * FROM liked_profiles WHERE liker_user_id = ? OR liked_user_id = ?"
        return db.selectDB([likerID, likedID], sql)
    },
    getUserProfile: async (id) => {
        const sql = `SELECT id, username, firstName, lastName, email, gender, preference, biography, ` +
        `latitude, longitude, profilePic, last_connection, DATE_FORMAT(born_date, "%Y-%m-%d") as born_date, notify, ` +
        `(SELECT GROUP_CONCAT(name SEPARATOR ',') FROM pictures WHERE user_id = ?) as otherPictures, ` +
        `(SELECT GROUP_CONCAT(name SEPARATOR ',') FROM tags WHERE user_id = ?) as tags FROM users WHERE id = ?`;
        return db.selectDB([id, id, id], sql)
    },
    // SELECT count(*) as totalUsers, (((SELECT count(*) as likes FROM liked_profiles WHERE liked_user_id = 2) +
    //  (SELECT count(*) as visits FROM visited_profiles WHERE visited_user_id = 2)) 
    //  - ((SELECT count(*) as blocks FROM blocked_users WHERE blocked_user_id = 2) + 
    //  (SELECT count(*) as reports FROM reported_users WHERE reported_user_id = 2))) as sum FROM users
    calculateFame: async (id) => {
        const sql = `SELECT count(*) as totalUsers, (((SELECT count(*) as likes FROM liked_profiles WHERE liked_user_id = 2) +` +
        `(SELECT count(*) as visits FROM visited_profiles WHERE visited_user_id = 2)) - ` +
        `((SELECT count(*) as blocks FROM blocked_users WHERE blocked_user_id = 2) + ` +
        `(SELECT count(*) as reports FROM reported_users WHERE reported_user_id = 2))) as sum FROM users`
        return db.selectDB([id, id], sql)
    },

}

module.exports = user;